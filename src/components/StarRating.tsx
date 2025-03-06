import { StarIcon } from "@heroicons/react/24/outline";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`w-4 h-4 ${
          star <= rating
            ? "text-yellow-400 fill-current"
            : "text-mono-dark-400 dark:text-mono-light-400"
        }`}
      />
    ))}
  </div>
);

export default StarRating;
