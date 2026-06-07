import { type FormEvent, useMemo, useState } from 'react';

import { AdminResourceTemplate } from '@/components/templates/admin-resource-template';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  blockUserRequest,
  deleteCommentRequest,
  deleteReviewRequest,
  hideCommentRequest,
  hideReviewRequest,
  unhideCommentRequest,
  unhideReviewRequest,
} from '@/lib/dal';
import { adminUrls } from '@/lib/api/admin.urls';
import type { ActionType, TargetType } from '@/types/admin';

type ActionOption = {
  value: SupportedAction;
  label: string;
  description: string;
  targetType: Exclude<TargetType, 'film'>;
};

type SupportedAction = Exclude<ActionType, 'unblock_user'>;

const actionOptions: ActionOption[] = [
  {
    value: 'hide_review',
    label: 'Hide review',
    description: 'POST /admin/reviews/:id/hide',
    targetType: 'review',
  },
  {
    value: 'unhide_review',
    label: 'Unhide review',
    description: 'POST /admin/reviews/:id/unhide',
    targetType: 'review',
  },
  {
    value: 'delete_review',
    label: 'Delete review',
    description: 'POST /admin/reviews/:id/delete',
    targetType: 'review',
  },
  {
    value: 'hide_comment',
    label: 'Hide comment',
    description: 'POST /admin/comments/:id/hide',
    targetType: 'comment',
  },
  {
    value: 'unhide_comment',
    label: 'Unhide comment',
    description: 'POST /admin/comments/:id/unhide',
    targetType: 'comment',
  },
  {
    value: 'delete_comment',
    label: 'Delete comment',
    description: 'POST /admin/comments/:id/delete',
    targetType: 'comment',
  },
  {
    value: 'block_user',
    label: 'Block user',
    description: 'POST /admin/users/:id/block',
    targetType: 'user',
  },
];

const actionPaths: Record<SupportedAction, string> = {
  hide_review: adminUrls.moderation.reviewHide('review-id'),
  unhide_review: adminUrls.moderation.reviewUnhide('review-id'),
  delete_review: adminUrls.moderation.reviewDelete('review-id'),
  hide_comment: adminUrls.moderation.commentHide('comment-id'),
  unhide_comment: adminUrls.moderation.commentUnhide('comment-id'),
  delete_comment: adminUrls.moderation.commentDelete('comment-id'),
  block_user: adminUrls.users.block('user-id'),
};

export function ModerationPage() {
  const [action, setAction] = useState<SupportedAction>('hide_review');
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selectedAction = useMemo(
    () => actionOptions.find((item) => item.value === action) ?? actionOptions[0]!,
    [action],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!targetId.trim() || !reason.trim()) return;

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        reason: reason.trim(),
        complaintId: complaintId.trim() || undefined,
      };

      if (action === 'hide_review') {
        await hideReviewRequest(targetId.trim(), payload);
      } else if (action === 'unhide_review') {
        await unhideReviewRequest(targetId.trim(), payload);
      } else if (action === 'delete_review') {
        await deleteReviewRequest(targetId.trim(), payload);
      } else if (action === 'hide_comment') {
        await hideCommentRequest(targetId.trim(), payload);
      } else if (action === 'unhide_comment') {
        await unhideCommentRequest(targetId.trim(), payload);
      } else if (action === 'delete_comment') {
        await deleteCommentRequest(targetId.trim(), payload);
      } else if (action === 'block_user') {
        await blockUserRequest(targetId.trim(), reason.trim());
      }

      setMessage(`Action ${action} submitted successfully`);
      setTargetId('');
      setReason('');
      setComplaintId('');
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Failed to submit moderation action',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminResourceTemplate
      title="Moderation"
      description="Execute review, comment, and user moderation actions."
      summary={
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardContent className="grid gap-3 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Moderation queue
              </p>
              <p className="text-sm text-slate-600">
                Resolve complaints and apply actions to reviews, comments, and users.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="grid gap-3 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Action path
              </p>
              <p className="break-all font-mono text-sm text-slate-700">
                {actionPaths[action]}
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="border-slate-200 bg-white/90 shadow-sm">
          <CardContent className="grid gap-4 p-5">
            <div className="grid gap-1">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Moderation form
              </p>
              <p className="text-sm text-slate-600">
                Select an action, target id, and reason. Complaint id is optional.
              </p>
            </div>

            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="moderation-action">Action</Label>
                <Select
                  id="moderation-action"
                  value={action}
                  onChange={(event) => {
                    const nextAction = event.target.value as SupportedAction;
                    setAction(nextAction);
                    setTargetId('');
                    setReason('');
                  }}
                >
                  {actionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moderation-target">Target id</Label>
                <Input
                  id="moderation-target"
                  value={targetId}
                  onChange={(event) => setTargetId(event.target.value)}
                  placeholder={`${selectedAction.targetType} id`}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moderation-reason">Reason</Label>
                <Input
                  id="moderation-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Moderation reason"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moderation-complaint-id">Complaint id</Label>
                <Input
                  id="moderation-complaint-id"
                  value={complaintId}
                  onChange={(event) => setComplaintId(event.target.value)}
                  placeholder="Optional complaint id"
                />
              </div>

              <Button disabled={busy || !targetId.trim() || !reason.trim()} type="submit">
                Submit action
              </Button>
            </form>

            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {actionOptions.map((option) => (
            <Card
              key={option.value}
              className="border-slate-200 bg-slate-50/80 shadow-none"
            >
              <CardContent className="grid gap-3 p-5">
                <div className="grid gap-1">
                  <h3 className="text-base font-semibold text-slate-950">
                    {option.label}
                  </h3>
                  <p className="text-xs text-slate-500">{option.description}</p>
                </div>
                <div className="grid gap-1 rounded-md border border-slate-200 bg-white px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Target type
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {option.targetType}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminResourceTemplate>
  );
}
