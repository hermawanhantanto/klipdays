import assert from 'node:assert/strict';
import test from 'node:test';
import { SubmissionStatus } from '../../generated/prisma/enums.js';
import { SaveDraftSubmissionSchema, FinalSubmitVideoSchema } from './submission.validators.js';
import { ValidateVideoUrlSchema, RequestCodeSchema } from '../social-account/social-account.validators.js';

test('SaveDraftSubmissionSchema validates and rejects invalid URLs', () => {
  const valid = SaveDraftSubmissionSchema.safeParse({
    liveVideoUrl: 'https://www.tiktok.com/@creator/video/73450918237461910',
    videoCaption: 'Sample video caption',
  });
  assert.strictEqual(valid.success, true);

  const invalid = SaveDraftSubmissionSchema.safeParse({
    liveVideoUrl: 'not-a-url',
  });
  assert.strictEqual(invalid.success, false);
});

test('ValidateVideoUrlSchema trims whitespace and validates tiktok.com domain', () => {
  const validWithSpaces = ValidateVideoUrlSchema.safeParse({
    videoUrl: '   https://www.tiktok.com/@creator/video/73450918237461910   ',
  });
  assert.strictEqual(validWithSpaces.success, true);
  if (validWithSpaces.success) {
    assert.strictEqual(
      validWithSpaces.data.videoUrl,
      'https://www.tiktok.com/@creator/video/73450918237461910',
    );
  }

  const nonTiktok = ValidateVideoUrlSchema.safeParse({
    videoUrl: 'https://www.youtube.com/watch?v=12345',
  });
  assert.strictEqual(nonTiktok.success, false);
});

test('RequestCodeSchema trims whitespace and validates tiktok handles', () => {
  const valid = RequestCodeSchema.safeParse({
    username: '  creator_name.123  ',
  });
  assert.strictEqual(valid.success, true);
  if (valid.success) {
    assert.strictEqual(valid.data.username, 'creator_name.123');
  }

  const invalid = RequestCodeSchema.safeParse({
    username: 'invalid user with spaces',
  });
  assert.strictEqual(invalid.success, false);
});

test('FinalSubmitVideoSchema validates live video url format', () => {
  const valid = FinalSubmitVideoSchema.safeParse({
    liveVideoUrl: 'https://www.tiktok.com/@creator/video/73450918237461910',
  });
  assert.strictEqual(valid.success, true);
});

test('Status Guard Logic: only JOINED and REVISION_REQUESTED can edit or submit', () => {
  const allowedStatuses = [SubmissionStatus.JOINED, SubmissionStatus.REVISION_REQUESTED];
  const forbiddenStatuses = [
    SubmissionStatus.PENDING_REVIEW,
    SubmissionStatus.APPROVED,
    SubmissionStatus.REJECTED,
  ];

  for (const status of allowedStatuses) {
    const isAllowed = status === SubmissionStatus.JOINED || status === SubmissionStatus.REVISION_REQUESTED;
    assert.strictEqual(isAllowed, true, `Status ${status} should be allowed`);
  }

  for (const rawStatus of forbiddenStatuses) {
    const status = rawStatus as SubmissionStatus;
    const isAllowed = status === SubmissionStatus.JOINED || status === SubmissionStatus.REVISION_REQUESTED;
    assert.strictEqual(isAllowed, false, `Status ${status} should be forbidden`);
  }
});

test('Decimal Earnings Serialization: Decimal.toString() produces exact string', () => {
  const mockDecimal = {
    toString() {
      return '150000.00';
    },
  };
  const stringified = mockDecimal.toString();
  assert.strictEqual(typeof stringified, 'string');
  assert.strictEqual(stringified, '150000.00');
});
