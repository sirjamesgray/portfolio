'use client';

import { useState, useCallback } from 'react';
import { DrillDownState, BreadcrumbItem } from '../types';

type ViewType = DrillDownState['view'];

export function useDrillDown() {
  const [state, setState] = useState<DrillDownState>({
    path: [{ id: 'home', name: 'Home Lab', type: 'home' }],
    view: 'overview',
  });

  // Navigate to overview
  const goToOverview = useCallback(() => {
    setState({
      path: [{ id: 'home', name: 'Home Lab', type: 'home' }],
      view: 'overview',
    });
  }, []);

  // Navigate to a pipeline stage
  const goToStage = useCallback((stage: 'research' | 'print' | 'market' | 'sales' | 'materials') => {
    const stageNames = {
      research: 'Research',
      print: 'Print Queue',
      materials: 'Materials',
      market: 'Ads',
      sales: 'Sales',
    };
    setState({
      path: [
        { id: 'home', name: 'Home Lab', type: 'home' },
        { id: stage, name: stageNames[stage], type: stage as BreadcrumbItem['type'] },
      ],
      view: stage as ViewType,
    });
  }, []);

  // Navigate to a specific product
  const goToProduct = useCallback((productId: string, productName: string) => {
    setState((prev) => ({
      path: [
        ...prev.path.slice(0, 1),
        { id: productId, name: productName, type: 'product' },
      ],
      view: 'product',
      selectedId: productId,
    }));
  }, []);

  // Navigate to a specific printer
  const goToPrinter = useCallback((printerId: string, printerName: string) => {
    setState({
      path: [
        { id: 'home', name: 'Home Lab', type: 'home' },
        { id: 'print', name: 'Print Queue', type: 'print' },
        { id: printerId, name: printerName, type: 'printer' },
      ],
      view: 'printer',
      selectedId: printerId,
    });
  }, []);

  // Go back one level
  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.path.length <= 1) return prev;
      const newPath = prev.path.slice(0, -1);
      const lastItem = newPath[newPath.length - 1];
      return {
        path: newPath,
        view: lastItem.type as ViewType,
        selectedId: lastItem.type === 'product' || lastItem.type === 'printer' ? lastItem.id : undefined,
      };
    });
  }, []);

  // Navigate to breadcrumb
  const goToBreadcrumb = useCallback((index: number) => {
    setState((prev) => {
      const newPath = prev.path.slice(0, index + 1);
      const lastItem = newPath[newPath.length - 1];
      return {
        path: newPath,
        view: lastItem.type as ViewType,
        selectedId: lastItem.type === 'product' || lastItem.type === 'printer' ? lastItem.id : undefined,
      };
    });
  }, []);

  return {
    state,
    currentView: state.view,
    selectedId: state.selectedId,
    breadcrumbs: state.path,
    goToOverview,
    goToStage,
    goToProduct,
    goToPrinter,
    goBack,
    goToBreadcrumb,
  };
}
