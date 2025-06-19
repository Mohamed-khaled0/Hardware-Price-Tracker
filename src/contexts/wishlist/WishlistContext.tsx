
import React, { createContext } from 'react';
import { WishlistContextType } from './types';

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
