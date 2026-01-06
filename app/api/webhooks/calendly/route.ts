import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

interface CalendlyInvitee {
  uri: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  canceled: boolean;
  questions_and_answers?: Array<{
    question: string;
    answer: string;
  }>;
}

interface CalendlyEvent {
  uri: string;
  name: string;
  start_time: string;
  end_time: string;
  event_type: {
    name: string;
    uri: string;
  };
}

interface CalendlyWebhookPayload {
  event: string;
  payload: {
    event: string;
    invitee: CalendlyInvitee;
    event_type?: {
      name: string;
      uri: string;
    };
    scheduled_event?: CalendlyEvent;
    uri?: string;
  };
}

/**
 * Verifies the Calendly webhook signature
 * Calendly uses HMAC-SHA256 with a signing key
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  signingKey: string
): boolean {
  if (!signature) {
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', signingKey);
    hmac.update(payload);
    const expectedSignature = hmac.digest('base64');

    // Use timingSafeEqual to prevent timing attacks
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

/**
 * Handles Calendly webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get the signing key from environment variables
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

    if (!signingKey) {
      console.error('CALENDLY_WEBHOOK_SIGNING_KEY is not configured');
      return NextResponse.json(
        { error: 'Webhook signing key not configured' },
        { status: 500 }
      );
    }

    // Get the raw body as text for signature verification
    const rawBody = await request.text();

    // Get the signature from headers
    // Calendly sends the signature in the 'Calendly-Webhook-Signature' header
    const signature = request.headers.get('calendly-webhook-signature');

    // Verify the webhook signature
    if (!verifyWebhookSignature(rawBody, signature, signingKey)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the payload
    const webhookPayload: CalendlyWebhookPayload = JSON.parse(rawBody);
    const { event, payload } = webhookPayload;

    console.log('Received Calendly webhook:', event);

    // Create Supabase admin client (webhooks don't have user context)
    const supabase = createAdminClient();

    // Handle different event types
    switch (event) {
      case 'invitee.created':
        await handleInviteeCreated(supabase, payload);
        break;

      case 'invitee.canceled':
        await handleInviteeCanceled(supabase, payload);
        break;

      default:
        console.log('Unhandled event type:', event);
        return NextResponse.json(
          { message: 'Event type not handled' },
          { status: 200 }
        );
    }

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handles invitee.created event
 * Creates a contact if not exists and creates a new project with 'lead' status
 */
async function handleInviteeCreated(supabase: any, payload: any) {
  const { invitee, scheduled_event } = payload;

  if (!invitee || !scheduled_event) {
    throw new Error('Missing invitee or scheduled_event data');
  }

  const inviteeEmail = invitee.email;
  const inviteeName = invitee.name;
  const inviteeUri = invitee.uri;
  const meetingTime = scheduled_event.start_time;
  const eventTypeName = scheduled_event.event_type?.name || 'Unknown Event';
  const eventUri = scheduled_event.uri;

  // Extract custom question answers
  const customAnswers = invitee.questions_and_answers || [];
  const notesFromAnswers = customAnswers
    .map((qa: any) => `${qa.question}: ${qa.answer}`)
    .join('\n');

  try {
    // Step 1: Check if contact exists, if not create one
    let { data: existingContact, error: contactFetchError } = await supabase
      .from('contacts')
      .select('id')
      .eq('email', inviteeEmail)
      .single();

    let contactId: string;

    if (contactFetchError && contactFetchError.code === 'PGRST116') {
      // Contact doesn't exist, create new one
      const { data: newContact, error: contactCreateError } = await supabase
        .from('contacts')
        .insert({
          name: inviteeName,
          email: inviteeEmail,
        })
        .select('id')
        .single();

      if (contactCreateError) {
        throw new Error(`Failed to create contact: ${contactCreateError.message}`);
      }

      contactId = newContact.id;
      console.log('Created new contact:', contactId);
    } else if (contactFetchError) {
      throw new Error(`Failed to fetch contact: ${contactFetchError.message}`);
    } else {
      // Contact exists, update the name if needed
      contactId = existingContact.id;

      await supabase
        .from('contacts')
        .update({
          name: inviteeName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contactId);

      console.log('Updated existing contact:', contactId);
    }

    // Step 2: Create a new project with 'lead' status
    const { data: newProject, error: projectCreateError } = await supabase
      .from('projects')
      .insert({
        contact_id: contactId,
        calendly_event_uri: eventUri,
        status: 'lead',
        meeting_time: meetingTime,
        event_type: eventTypeName,
        notes: notesFromAnswers || null,
      })
      .select('id')
      .single();

    if (projectCreateError) {
      throw new Error(`Failed to create project: ${projectCreateError.message}`);
    }

    console.log('Created new project:', newProject.id);

    // Step 3: Log the activity
    const { error: activityLogError } = await supabase
      .from('activity_log')
      .insert({
        project_id: newProject.id,
        action: 'meeting_scheduled',
        details: {
          event: 'invitee.created',
          invitee_uri: inviteeUri,
          event_uri: eventUri,
          event_type: eventTypeName,
          meeting_time: meetingTime,
          custom_answers: customAnswers,
        },
      });

    if (activityLogError) {
      console.error('Failed to log activity:', activityLogError.message);
      // Don't throw here - activity log failure shouldn't fail the whole operation
    }

    console.log('Successfully processed invitee.created event');

  } catch (error) {
    console.error('Error in handleInviteeCreated:', error);
    throw error;
  }
}

/**
 * Handles invitee.canceled event
 * Updates the project status to 'canceled'
 */
async function handleInviteeCanceled(supabase: any, payload: any) {
  const { invitee, scheduled_event } = payload;

  if (!invitee || !scheduled_event) {
    throw new Error('Missing invitee or scheduled_event data');
  }

  const eventUri = scheduled_event.uri;

  try {
    // Find the project by calendly_event_uri
    const { data: project, error: projectFetchError } = await supabase
      .from('projects')
      .select('id')
      .eq('calendly_event_uri', eventUri)
      .single();

    if (projectFetchError) {
      if (projectFetchError.code === 'PGRST116') {
        console.warn('No project found for canceled event:', eventUri);
        return; // Don't fail if project doesn't exist
      }
      throw new Error(`Failed to fetch project: ${projectFetchError.message}`);
    }

    // Update the project status to 'canceled'
    const { error: projectUpdateError } = await supabase
      .from('projects')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id);

    if (projectUpdateError) {
      throw new Error(`Failed to update project: ${projectUpdateError.message}`);
    }

    console.log('Updated project to canceled:', project.id);

    // Log the activity
    const { error: activityLogError } = await supabase
      .from('activity_log')
      .insert({
        project_id: project.id,
        action: 'meeting_canceled',
        details: {
          event: 'invitee.canceled',
          event_uri: eventUri,
          canceled_at: new Date().toISOString(),
        },
      });

    if (activityLogError) {
      console.error('Failed to log activity:', activityLogError.message);
      // Don't throw here - activity log failure shouldn't fail the whole operation
    }

    console.log('Successfully processed invitee.canceled event');

  } catch (error) {
    console.error('Error in handleInviteeCanceled:', error);
    throw error;
  }
}
