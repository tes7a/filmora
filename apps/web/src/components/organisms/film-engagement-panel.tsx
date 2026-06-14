'use client';

import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getAuthSession } from '../../lib/config/auth-storage';
import {
  addFilmToList,
  createFilmReview,
  getFilmReviews,
  getMyFilmRating,
  getMyLists,
  updateFilmRating,
  updateFilmReview,
} from '../../lib/api';
import type { FilmReview, MyFilmRating, UserList } from '../../types/api';

type FilmEngagementPanelProps = {
  filmId: string;
};

function getReviewBody(review: FilmReview) {
  return review.currentVersion?.body ?? '';
}

function getReviewTitle(review: FilmReview) {
  return review.currentVersion?.title ?? 'Untitled review';
}

export function FilmEngagementPanel({ filmId }: FilmEngagementPanelProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<FilmReview[]>([]);
  const [rating, setRating] = useState<MyFilmRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState('8');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [lists, setLists] = useState<UserList[]>([]);
  const [listId, setListId] = useState('');

  const session = useMemo(() => getAuthSession(), []);
  const token = session.accessToken;
  const currentUserId = session.user?.id ?? null;
  const watchlist = lists.find((list) => list.type === 'watchlist') ?? null;
  const watchedList = lists.find((list) => list.type === 'watched') ?? null;

  const myReview = useMemo(() => {
    if (!currentUserId) return null;

    return (
      reviews.find(
        (review) => review.user.id === currentUserId && review.currentVersion !== null,
      ) ?? null
    );
  }, [currentUserId, reviews]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [filmReviews, myRating, myLists] = await Promise.all([
          getFilmReviews(filmId, token ?? undefined),
          token
            ? getMyFilmRating(filmId, token).catch(() => null)
            : Promise.resolve(null),
          token ? getMyLists(token).catch(() => []) : Promise.resolve([]),
        ]);

        if (!active) return;

        setReviews(filmReviews);
        setRating(myRating);
        setLists(myLists);
        setListId((current) => current || myLists[0]?.id || '');

        if (myRating?.userScore) {
          setRatingValue(String(myRating.userScore));
        }
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load engagement data',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [filmId, token]);

  useEffect(() => {
    if (myReview) {
      setReviewTitle(getReviewTitle(myReview));
      setReviewBody(getReviewBody(myReview));
    }
  }, [myReview]);

  async function handleRatingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      router.push('/login');
      return;
    }

    setSubmittingRating(true);
    setError(null);

    try {
      const response = await updateFilmRating(filmId, token, Number(ratingValue));
      setRating({
        filmId: response.filmId,
        userScore: response.userScore,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Failed to save rating',
      );
    } finally {
      setSubmittingRating(false);
    }
  }

  async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      router.push('/login');
      return;
    }

    setSubmittingReview(true);
    setError(null);

    try {
      if (myReview) {
        await updateFilmReview(filmId, token, {
          title: reviewTitle,
          body: reviewBody,
        });
      } else {
        await createFilmReview(filmId, token, {
          title: reviewTitle,
          body: reviewBody,
        });
      }

      const freshReviews = await getFilmReviews(filmId, token);
      setReviews(freshReviews);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Failed to save review',
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleAddToList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      router.push('/login');
      return;
    }

    if (!listId) {
      setListError('Pick a list first.');
      return;
    }

    setAddingToList(true);
    setListError(null);
    setError(null);

    try {
      await addFilmToList(token, listId, { filmId });
      setListError('Film saved to list.');
    } catch (submitError) {
      setListError(
        submitError instanceof Error ? submitError.message : 'Failed to save film',
      );
    } finally {
      setAddingToList(false);
    }
  }

  async function handleQuickAdd(targetList: UserList | null, label: string) {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!targetList) {
      setListError(`No ${label.toLowerCase()} list available.`);
      return;
    }

    setAddingToList(true);
    setListError(null);
    setError(null);

    try {
      await addFilmToList(token, targetList.id, { filmId });
      setListError(`Added to ${label}.`);
    } catch (submitError) {
      setListError(
        submitError instanceof Error ? submitError.message : `Failed to add to ${label}`,
      );
    } finally {
      setAddingToList(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <Card className="border-slate-200/80 bg-white/90">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            Rating
          </Badge>
          <CardTitle className="text-xl">Your score</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Update your personal rating for this film.
          </p>
        </CardHeader>
        <CardContent>
          {token ? (
            <form className="grid gap-4" onSubmit={handleRatingSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="rating">Score</Label>
                <select
                  id="rating"
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
                  value={ratingValue}
                  onChange={(event) => setRatingValue(event.target.value)}
                >
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" disabled={submittingRating}>
                {submittingRating
                  ? 'Saving...'
                  : rating?.userScore
                    ? 'Update rating'
                    : 'Save rating'}
              </Button>
            </form>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-slate-600">Sign in to save your own rating.</p>
              <Button href="/login">Sign in</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/90">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            Lists
          </Badge>
          <CardTitle className="text-xl">Save to list</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Add this film to one of your personal collections.
          </p>
        </CardHeader>
        <CardContent>
          {token ? (
            <div className="grid gap-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start"
                  disabled={addingToList}
                  onClick={() => void handleQuickAdd(watchlist, 'Watchlist')}
                >
                  {addingToList ? 'Saving...' : 'Add to Watchlist'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start"
                  disabled={addingToList}
                  onClick={() => void handleQuickAdd(watchedList, 'Watched')}
                >
                  {addingToList ? 'Saving...' : 'Mark as Watched'}
                </Button>
              </div>

              <form className="grid gap-4" onSubmit={handleAddToList}>
                <div className="grid gap-2">
                  <Label htmlFor="listId">Custom list</Label>
                  <select
                    id="listId"
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
                    value={listId}
                    onChange={(event) => setListId(event.target.value)}
                  >
                    {lists.length ? (
                      lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No lists available</option>
                    )}
                  </select>
                </div>

                <Button type="submit" disabled={addingToList || !lists.length}>
                  {addingToList ? 'Saving...' : 'Save film'}
                </Button>
              </form>

              {listError ? <p className="text-sm text-slate-600">{listError}</p> : null}
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm text-slate-600">
                Sign in to save this film to your lists.
              </p>
              <Button href="/login">Sign in</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white/90">
        <CardHeader className="space-y-2">
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
            Reviews
          </Badge>
          <CardTitle className="text-xl">Community feedback</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            Public reviews are loaded from the API.
          </p>
        </CardHeader>
        <CardContent className="grid gap-5">
          <form className="grid gap-4" onSubmit={handleReviewSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="reviewTitle">Title</Label>
              <Input
                id="reviewTitle"
                value={reviewTitle}
                onChange={(event) => setReviewTitle(event.target.value)}
                placeholder="Short review title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reviewBody">Review</Label>
              <Textarea
                id="reviewBody"
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                placeholder="Write your thoughts..."
              />
            </div>

            {token ? (
              <Button type="submit" disabled={submittingReview}>
                {submittingReview
                  ? 'Saving...'
                  : myReview
                    ? 'Update review'
                    : 'Create review'}
              </Button>
            ) : (
              <Button href="/login">Sign in to review</Button>
            )}
          </form>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="grid gap-3">
            {loading ? (
              <p className="text-sm text-slate-600">Loading reviews...</p>
            ) : reviews.length ? (
              reviews.map((review) => (
                <article
                  key={review.reviewId}
                  className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="grid gap-1">
                      <p className="font-medium text-slate-950">
                        {getReviewTitle(review)}
                      </p>
                      <p className="text-sm text-slate-600">
                        by {review.user.displayName}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {review.status}
                    </Badge>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">
                    {getReviewBody(review)}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">No reviews yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
