"use client";

import React from 'react';

interface RatingBarProps {
  stars: number;
  count: number;
  total: number;
}

const RatingBar: React.FC<RatingBarProps> = ({ stars, count, total }) => (
  <div className="flex items-center mb-1">
    <span className="w-16 text-sm text-gray-600">{stars} Star</span>
    <div className="flex-grow h-2 bg-gray-200 rounded-full mx-2">
      <div 
        className="h-full bg-yellow-400 rounded-full" 
        style={{ width: `${(count / total) * 100}%` }}
      ></div>
    </div>
    <span className="w-8 text-sm text-gray-600 text-right">{count}</span>
  </div>
);

interface ReviewCardProps {
  name: string;
  date: string;
  content: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, date, content }) => (
  <div className="border-t border-gray-200 pt-4 mt-4">
    <div className="flex items-center mb-2">
      <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-semibold mr-3">
        {name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
    </div>
    <p className="text-gray-700">{content}</p>
    <div className="mt-2">
      <button className="text-sm text-gray-600 mr-4 hover:underline">Helpful</button>
      <button className="text-sm text-gray-600 hover:underline">Not helpful</button>
    </div>
  </div>
);

interface RatingData {
  stars: number;
  count: number;
}

export default function SimpleRatingComponent() {
  const totalReviews: number = 3014;
  const ratingData: RatingData[] = [
    { stars: 5, count: 58 },
    { stars: 4, count: 20 },
    { stars: 3, count: 15 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4">80 Reviews</h3>
      <div className="flex items-start mb-6">
        <div className="bg-pink-50 p-4 rounded-lg mr-6">
          <div className="text-4xl font-bold text-yellow-400">4.96</div>
          <div className="text-sm font-semibold text-gray-700">Exceptional</div>
          <div className="text-xs text-gray-600">{totalReviews} reviews</div>
        </div>
        <div className="flex-grow">
          {ratingData.map((rating) => (
            <RatingBar key={rating.stars} stars={rating.stars} count={rating.count} total={totalReviews} />
          ))}
        </div>
      </div>
      
      <ReviewCard 
        name="Bessie Cooper"
        date="12 March 2022"
        content="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text."
      />
      
      <ReviewCard 
        name="Darrell Steward"
        date="12 March 2022"
        content="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text."
      />
    </div>
  );
}