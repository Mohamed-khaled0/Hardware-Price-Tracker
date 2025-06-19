
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const [sessionId] = useState(() => 
    localStorage.getItem('session_id') || 
    (() => {
      const id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', id);
      return id;
    })()
  );

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error in fetchReviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!reviewerName.trim() || rating === 0) {
      toast.error('Please provide your name and rating');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert([
          {
            product_id: productId,
            user_id: user?.id || null,
            session_id: user ? null : sessionId,
            reviewer_name: reviewerName.trim(),
            rating,
            comment: comment.trim() || null
          }
        ]);

      if (error) {
        toast.error('Failed to submit review');
        console.error('Error submitting review:', error);
        return;
      }

      toast.success('Review submitted successfully!');
      setReviewerName('');
      setRating(0);
      setComment('');
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < currentRating 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>
          {reviews.length > 0 
            ? `${reviews.length} review${reviews.length !== 1 ? 's' : ''} • Average: ${averageRating.toFixed(1)}/5`
            : 'No reviews yet'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Review Form */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <Input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {renderStars(rating, true)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={3}
              />
            </div>
            <Button 
              onClick={submitReview}
              disabled={submitting}
              className="bg-[#39536f] hover:bg-[#2a405a]"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div>Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{review.reviewer_name}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-1 mb-2">
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
