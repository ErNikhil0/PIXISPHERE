import RatingStars from '../common/RatingStars';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold">{review.name}</h4>
          <p className="text-gray-500 text-sm">
            {new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
}