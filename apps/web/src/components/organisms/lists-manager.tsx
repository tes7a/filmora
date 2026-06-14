'use client';

import { type FormEvent, useEffect, useState } from 'react';

import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  addFilmToList,
  createCustomList,
  getMyLists,
  removeFilmFromList,
  updateList,
} from '../../lib/api';
import type { UserList } from '../../types/api';

type ListsManagerProps = {
  accessToken: string;
  initialLists: UserList[];
};

type DraftState = Record<string, { name: string; isPublic: boolean }>;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export function ListsManager({ accessToken, initialLists }: ListsManagerProps) {
  const [lists, setLists] = useState<UserList[]>(initialLists);
  const [drafts, setDrafts] = useState<DraftState>({});
  const [createName, setCreateName] = useState('');
  const [createIsPublic, setCreateIsPublic] = useState(false);
  const [addFilmListId, setAddFilmListId] = useState(initialLists[0]?.id ?? '');
  const [addFilmId, setAddFilmId] = useState('');
  const [addPosition, setAddPosition] = useState('');
  const [addNote, setAddNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setLists(initialLists);
    setDrafts(
      Object.fromEntries(
        initialLists.map((list) => [
          list.id,
          { name: list.name, isPublic: list.isPublic },
        ]),
      ),
    );
  }, [initialLists]);

  useEffect(() => {
    if (!addFilmListId && initialLists[0]) {
      setAddFilmListId(initialLists[0].id);
    }
  }, [initialLists, addFilmListId]);

  async function refreshLists() {
    const nextLists = await getMyLists(accessToken);
    setLists(nextLists);
    setDrafts(
      Object.fromEntries(
        nextLists.map((list) => [list.id, { name: list.name, isPublic: list.isPublic }]),
      ),
    );

    if (!nextLists.some((list) => list.id === addFilmListId)) {
      setAddFilmListId(nextLists[0]?.id ?? '');
    }
  }

  async function handleCreateList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createName.trim()) {
      setActionMessage(null);
      setActionError('List name is required.');
      return;
    }

    setLoading(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await createCustomList(accessToken, {
        name: createName.trim(),
        isPublic: createIsPublic,
      });
      setCreateName('');
      setCreateIsPublic(false);
      await refreshLists();
      setActionMessage('List created.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateList(event: FormEvent<HTMLFormElement>, listId: string) {
    event.preventDefault();
    const draft = drafts[listId];
    const nextName = draft?.name?.trim() ?? '';

    if (!nextName) {
      setActionMessage(null);
      setActionError('List name is required.');
      return;
    }

    setLoading(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await updateList(accessToken, listId, {
        name: nextName,
        isPublic: draft?.isPublic,
      });
      await refreshLists();
      setActionMessage('List updated.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to update list');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFilm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!addFilmListId) return;
    if (!addFilmId.trim()) {
      setActionMessage(null);
      setActionError('Film ID is required.');
      return;
    }

    const nextPosition = addPosition.trim() ? Number(addPosition) : null;

    if (nextPosition !== null && Number.isNaN(nextPosition)) {
      setActionMessage(null);
      setActionError('Position must be a number.');
      return;
    }

    setLoading(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await addFilmToList(accessToken, addFilmListId, {
        filmId: addFilmId.trim(),
        position: nextPosition,
        note: addNote.trim() || null,
      });
      setAddFilmId('');
      setAddPosition('');
      setAddNote('');
      await refreshLists();
      setActionMessage('Film added to list.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to add film');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFilm(listId: string, filmId: string) {
    setLoading(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await removeFilmFromList(accessToken, listId, filmId);
      await refreshLists();
      setActionMessage('Film removed.');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Failed to remove film');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200/80 bg-white/90">
      <CardHeader className="space-y-2">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          Collections
        </Badge>
        <CardTitle className="text-xl">My lists</CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          Create, update, and manage your custom lists from one place.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4 xl:grid-cols-2">
          <form
            className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            onSubmit={handleCreateList}
          >
            <div className="grid gap-2">
              <Label htmlFor="createListName">Create list</Label>
              <Input
                id="createListName"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Top Sci-Fi"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="createListVisibility">Visibility</Label>
              <select
                id="createListVisibility"
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
                value={createIsPublic ? 'public' : 'private'}
                onChange={(event) => setCreateIsPublic(event.target.value === 'public')}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              Create list
            </Button>
          </form>

          <form
            className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            onSubmit={handleAddFilm}
          >
            <div className="grid gap-2">
              <Label htmlFor="addFilmList">Add film to list</Label>
              <select
                id="addFilmList"
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
                value={addFilmListId}
                onChange={(event) => setAddFilmListId(event.target.value)}
              >
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filmId">Film ID</Label>
              <Input
                id="filmId"
                value={addFilmId}
                onChange={(event) => setAddFilmId(event.target.value)}
                placeholder="Film UUID"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  value={addPosition}
                  onChange={(event) => setAddPosition(event.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note</Label>
                <Input
                  id="note"
                  value={addNote}
                  onChange={(event) => setAddNote(event.target.value)}
                  placeholder="Must watch"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading || !addFilmListId}>
              Add film
            </Button>
          </form>
        </div>

        {actionMessage ? (
          <p className="text-sm text-emerald-700">{actionMessage}</p>
        ) : null}
        {actionError ? <p className="text-sm text-rose-700">{actionError}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lists.map((list) => {
            const isCustomList = list.type === 'custom';
            const draft = drafts[list.id] ?? { name: list.name, isPublic: list.isPublic };

            return (
              <article
                key={list.id}
                className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <form
                  className="grid gap-3"
                  onSubmit={(event) => void handleUpdateList(event, list.id)}
                >
                  <div className="grid gap-2">
                    <Label htmlFor={`name-${list.id}`}>Name</Label>
                    <Input
                      id={`name-${list.id}`}
                      value={draft.name}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [list.id]: {
                            ...draft,
                            name: event.target.value,
                          },
                        }))
                      }
                      disabled={!isCustomList}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`visibility-${list.id}`}>Visibility</Label>
                    <select
                      id={`visibility-${list.id}`}
                      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-slate-300 focus:ring-4 focus:ring-slate-950/5"
                      value={draft.isPublic ? 'public' : 'private'}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [list.id]: {
                            ...draft,
                            isPublic: event.target.value === 'public',
                          },
                        }))
                      }
                      disabled={!isCustomList}
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={loading || !isCustomList}
                  >
                    {isCustomList ? 'Save changes' : 'System list'}
                  </Button>
                </form>

                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="grid gap-1">
                    <p className="font-medium text-slate-950">{list.name}</p>
                    <p className="text-sm text-slate-600">{list.type}</p>
                  </div>
                  <Badge
                    variant={
                      list.type === 'custom'
                        ? list.isPublic
                          ? 'default'
                          : 'secondary'
                        : 'accent'
                    }
                    className="rounded-full px-3 py-1"
                  >
                    {list.type === 'custom'
                      ? list.isPublic
                        ? 'Public'
                        : 'Private'
                      : list.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Items
                    </p>
                    <p className="mt-1 font-medium text-slate-950">{list.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Updated
                    </p>
                    <p className="mt-1 font-medium text-slate-950">
                      {formatDate(list.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {list.items.length ? (
                    list.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <div className="grid gap-1">
                          <p className="text-sm font-medium text-slate-950">
                            {item.note ?? item.filmId}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.position !== null
                              ? `Position ${item.position}`
                              : 'No position'}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={loading}
                          onClick={() => void handleRemoveFilm(list.id, item.filmId)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No items yet.</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
