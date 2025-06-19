
import React, { createContext } from 'react';
import { ComparisonContextType } from './types';

export const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
