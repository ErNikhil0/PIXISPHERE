import ReviewCard from './ReviewCard';

export default function Reviews({ reviews }) {
  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}