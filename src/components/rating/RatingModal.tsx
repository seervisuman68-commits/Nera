import React, { useState } from 'react';
import { Shift } from '../../types';
import { useShifts } from '../../context/ShiftContext';
import { Star, CheckCircle, X, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  shift: Shift;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ shift, isOpen, onClose, onSubmitted }) => {
  const { submitShiftRating } = useShifts();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>('Punctual, great skills, zero handholding needed. Absolute lifesaver!');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Punctual', 'Fast Learner', 'Great Attitude']);

  if (!isOpen) return null;

  const availableTags = [
    'Super Punctual',
    'Fast Learner',
    'Great Attitude',
    'Latte Art Pro',
    'ServSafe Expert',
    'Zero Handholding',
    'Rush Hour Champion',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitShiftRating(shift.id, rating, review, selectedTags);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {}
    if (onSubmitted) onSubmitted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base">Rate Worker & Update Reliability</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
              alt={shift.assignedWorkerName}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400 mb-2"
            />
            <h4 className="font-bold text-slate-900 text-base">{shift.assignedWorkerName}</h4>
            <p className="text-xs text-slate-500">{shift.role} at {shift.businessName}</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Badge Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Endorse Skill Badges
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      active
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Written Performance Feedback
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="How was the worker's performance and punctuality?"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm rounded-xl shadow-md hover:from-amber-600 hover:to-orange-700 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Submit Rating & Update Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
