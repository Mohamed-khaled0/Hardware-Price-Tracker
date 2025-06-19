
-- Create table for product price history tracking
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL DEFAULT 'dummyjson',
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for wishlist items
CREATE TABLE public.wishlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  product_id INTEGER NOT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT wishlist_unique_product UNIQUE (user_id, product_id, session_id)
);

-- Create table for product comparisons
CREATE TABLE public.product_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  product_ids INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for product reviews
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id UUID,
  session_id TEXT,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX idx_price_history_recorded_at ON public.price_history(recorded_at);
CREATE INDEX idx_wishlist_items_product_id ON public.wishlist_items(product_id);
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);

-- Enable RLS on all tables
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for price_history (public read access)
CREATE POLICY "Anyone can view price history" 
  ON public.price_history 
  FOR SELECT 
  TO public
  USING (true);

-- RLS policies for wishlist_items (user-specific or session-specific)
CREATE POLICY "Users can view their own wishlist items" 
  ON public.wishlist_items 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can insert their own wishlist items" 
  ON public.wishlist_items 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can delete their own wishlist items" 
  ON public.wishlist_items 
  FOR DELETE 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- RLS policies for product_comparisons
CREATE POLICY "Users can view their own comparisons" 
  ON public.product_comparisons 
  FOR SELECT 
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can insert their own comparisons" 
  ON public.product_comparisons 
  FOR INSERT 
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- RLS policies for product_reviews (public read, authenticated write)
CREATE POLICY "Anyone can view reviews" 
  ON public.product_reviews 
  FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Anyone can insert reviews" 
  ON public.product_reviews 
  FOR INSERT 
  TO public
  WITH CHECK (true);
