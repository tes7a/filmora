import { PrismaPg } from '@prisma/adapter-pg';
import {
  film_status,
  genre_status,
  person_status,
  PrismaClient,
  role_type,
  tag_status,
  user_status,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Seed roles
  const roles = [
    { code: 'user' as const, name: 'User', description: 'Regular user role' },
    {
      code: 'moderator' as const,
      name: 'Moderator',
      description: 'Moderator role',
    },
    {
      code: 'admin' as const,
      name: 'Admin',
      description: 'Administrator role',
    },
  ];

  for (const role of roles) {
    const existing = await prisma.roles.findFirst({
      where: { code: role.code },
    });

    if (!existing) {
      await prisma.roles.create({ data: role });
      console.log(`Role "${role.code}" created`);
    } else {
      console.log(`Role "${role.code}" already exists`);
    }
  }

  const roleRecords = await prisma.roles.findMany({
    where: { code: { in: ['user', 'moderator', 'admin'] } },
  });

  const roleByCode = new Map(roleRecords.map((r) => [r.code, r]));

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const now = new Date();

  const firstNames = [
    'Alex',
    'Mia',
    'Ivan',
    'Emma',
    'Liam',
    'Olga',
    'Noah',
    'Sofia',
    'Mark',
    'Anna',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Brown',
    'Ivanov',
    'Petrova',
    'Sidorov',
    'Miller',
    'Davis',
    'Garcia',
    'Wilson',
  ];

  const randomItem = <T>(items: T[]) =>
    items[Math.floor(Math.random() * items.length)];

  const randomPastDate = (days: number) => {
    const offset = Math.floor(Math.random() * days);
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return d;
  };

  const ageRatings = ['G', 'PG', 'PG-13', 'R'] as const;
  const filmAdjectives = [
    'Silent',
    'Hidden',
    'Broken',
    'Golden',
    'Midnight',
    'Neon',
    'Lost',
    'Final',
    'Last',
    'Dark',
  ];
  const filmNouns = [
    'Code',
    'Echo',
    'Signal',
    'City',
    'Orbit',
    'Memory',
    'Shadow',
    'Protocol',
    'Horizon',
    'Legacy',
  ];

  const ensureUser = async (
    email: string,
    displayName: string,
    lastLoginAt?: Date | null,
  ) => {
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) return existing;

    return prisma.users.create({
      data: {
        email,
        password_hash: passwordHash,
        display_name: displayName,
        status: user_status.active,
        created_at: now,
        updated_at: now,
        last_login_at: lastLoginAt ?? null,
      },
    });
  };

  const ensureRole = async (
    userId: string,
    roleCode: 'user' | 'moderator' | 'admin',
  ) => {
    const role = roleByCode.get(roleCode);
    if (!role) return;

    const existing = await prisma.user_roles.findFirst({
      where: { user_id: userId, role_id: role.id },
    });

    if (existing) return;

    await prisma.user_roles.create({
      data: {
        user_id: userId,
        role_id: role.id,
        assigned_at: now,
      },
    });
  };

  const ensureMigrationRecord = async (id: number, appliedAt: Date) => {
    const existing = await prisma.migrations.findUnique({ where: { id } });
    if (existing) return existing;

    return prisma.migrations.create({
      data: { id, applied_at: appliedAt },
    });
  };

  const ensureAuthSession = async (params: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    ip?: string | null;
    userAgent?: string | null;
  }) => {
    const existing = await prisma.auth_sessions.findUnique({
      where: { refresh_token: params.refreshToken },
    });

    if (existing) return existing;

    return prisma.auth_sessions.create({
      data: {
        user_id: params.userId,
        refresh_token: params.refreshToken,
        expires_at: params.expiresAt,
        created_at: now,
        ip: params.ip ?? null,
        user_agent: params.userAgent ?? null,
      },
    });
  };

  const ensureRating = async (params: {
    userId: string;
    filmId: string;
    score: number;
  }) => {
    const existing = await prisma.ratings.findUnique({
      where: {
        user_id_film_id: {
          user_id: params.userId,
          film_id: params.filmId,
        },
      },
    });

    if (existing) {
      return prisma.ratings.update({
        where: { id: existing.id },
        data: {
          score: params.score,
          updated_at: now,
        },
      });
    }

    return prisma.ratings.create({
      data: {
        user_id: params.userId,
        film_id: params.filmId,
        score: params.score,
        created_at: now,
        updated_at: now,
      },
    });
  };

  const ensureUserList = async (params: {
    userId: string;
    name: string;
    type: 'watchlist' | 'watched' | 'custom';
    isPublic?: boolean;
  }) => {
    const existing = await prisma.user_lists.findFirst({
      where: {
        user_id: params.userId,
        name: params.name,
      },
    });

    if (existing) return existing;

    return prisma.user_lists.create({
      data: {
        user_id: params.userId,
        name: params.name,
        type: params.type,
        is_public: params.isPublic ?? false,
        created_at: now,
        updated_at: now,
      },
    });
  };

  const ensureUserListItem = async (params: {
    listId: string;
    userId: string;
    filmId: string;
    position?: number | null;
    note?: string | null;
  }) => {
    const existing = await prisma.user_list_items.findUnique({
      where: {
        user_id_list_id_film_id: {
          user_id: params.userId,
          list_id: params.listId,
          film_id: params.filmId,
        },
      },
    });

    if (existing) {
      return prisma.user_list_items.update({
        where: { id: existing.id },
        data: {
          position: params.position ?? existing.position,
          note: params.note ?? existing.note,
        },
      });
    }

    return prisma.user_list_items.create({
      data: {
        list_id: params.listId,
        user_id: params.userId,
        film_id: params.filmId,
        position: params.position ?? null,
        note: params.note ?? null,
        created_at: now,
      },
    });
  };

  const ensureReview = async (params: {
    userId: string;
    filmId: string;
    title: string;
    body: string;
    status?: 'visible' | 'hidden' | 'deleted';
  }) => {
    const existing = await prisma.reviews.findUnique({
      where: {
        user_id_film_id: {
          user_id: params.userId,
          film_id: params.filmId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.reviews.create({
      data: {
        user_id: params.userId,
        film_id: params.filmId,
        status: params.status ?? 'visible',
        created_at: now,
        updated_at: now,
      },
    });
  };

  const ensureReviewVersion = async (params: {
    reviewId: string;
    versionNumber: number;
    title: string;
    body: string;
    editedByUserId?: string | null;
  }) => {
    const existing = await prisma.review_versions.findUnique({
      where: {
        review_id_version_number: {
          review_id: params.reviewId,
          version_number: params.versionNumber,
        },
      },
    });

    if (existing) return existing;

    return prisma.review_versions.create({
      data: {
        review_id: params.reviewId,
        version_number: params.versionNumber,
        title: params.title,
        body: params.body,
        created_at: now,
        edited_by_user_id: params.editedByUserId ?? null,
      },
    });
  };

  const ensureComment = async (params: {
    reviewId: string;
    userId: string;
    body: string;
    parentId?: string | null;
    status?: 'visible' | 'hidden' | 'deleted';
  }) => {
    const existing = await prisma.comments.findFirst({
      where: {
        review_id: params.reviewId,
        user_id: params.userId,
        body: params.body,
        parent_id: params.parentId ?? null,
      },
      select: { id: true },
    });

    if (existing) {
      return prisma.comments.findUniqueOrThrow({ where: { id: existing.id } });
    }

    return prisma.comments.create({
      data: {
        review_id: params.reviewId,
        user_id: params.userId,
        body: params.body,
        parent_id: params.parentId ?? null,
        status: params.status ?? 'visible',
        created_at: now,
        updated_at: now,
      },
    });
  };

  const ensureComplaint = async (params: {
    userId: string;
    targetType: 'review' | 'comment';
    targetId: string;
    reason: string;
    status?: 'pending' | 'in_review' | 'resolved' | 'rejected';
  }) => {
    const existing = await prisma.complaints.findFirst({
      where: {
        user_id: params.userId,
        target_type: params.targetType,
        target_id: params.targetId,
        reason: params.reason,
      },
      select: { id: true },
    });

    if (existing) {
      return prisma.complaints.findUniqueOrThrow({
        where: { id: existing.id },
      });
    }

    return prisma.complaints.create({
      data: {
        user_id: params.userId,
        target_type: params.targetType,
        target_id: params.targetId,
        reason: params.reason,
        status: params.status ?? 'pending',
        created_at: now,
        updated_at: now,
      },
    });
  };

  const ensureModerationAction = async (params: {
    moderatorId: string;
    targetType: 'review' | 'comment' | 'user' | 'film';
    targetId: string;
    actionType:
      | 'hide_review'
      | 'unhide_review'
      | 'hide_comment'
      | 'unhide_comment'
      | 'block_user'
      | 'unblock_user'
      | 'hide_film'
      | 'unhide_film';
    reason?: string | null;
    complaintId?: string | null;
  }) => {
    const existing = await prisma.moderation_actions.findFirst({
      where: {
        moderator_id: params.moderatorId,
        target_type: params.targetType,
        target_id: params.targetId,
        action_type: params.actionType,
      },
      select: { id: true },
    });

    if (existing) {
      return prisma.moderation_actions.findUniqueOrThrow({
        where: { id: existing.id },
      });
    }

    return prisma.moderation_actions.create({
      data: {
        moderator_id: params.moderatorId,
        target_type: params.targetType,
        target_id: params.targetId,
        action_type: params.actionType,
        reason: params.reason ?? null,
        complaint_id: params.complaintId ?? null,
        created_at: now,
      },
    });
  };

  // Seed admin & moderator
  const adminUser = await ensureUser('admin@example.com', 'Admin');
  await ensureRole(adminUser.id, 'admin');

  const moderatorUser = await ensureUser('moderator@example.com', 'Moderator');
  await ensureRole(moderatorUser.id, 'moderator');

  // Seed mock users
  for (let i = 1; i <= 50; i += 1) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const email = `user${i}@example.com`;
    const displayName = `${firstName} ${lastName}`;
    const lastLoginAt = Math.random() < 0.8 ? randomPastDate(60) : null;
    const user = await ensureUser(email, displayName, lastLoginAt);
    await ensureRole(user.id, 'user');
  }

  // Seed genres
  const genresToSeed = [
    { name: 'Action', slug: 'action', description: 'Action films' },
    { name: 'Drama', slug: 'drama', description: 'Drama films' },
    { name: 'Comedy', slug: 'comedy', description: 'Comedy films' },
    { name: 'Sci-Fi', slug: 'sci-fi', description: 'Science fiction films' },
    { name: 'Thriller', slug: 'thriller', description: 'Thriller films' },
    { name: 'Fantasy', slug: 'fantasy', description: 'Fantasy films' },
    { name: 'Crime', slug: 'crime', description: 'Crime films' },
    { name: 'Adventure', slug: 'adventure', description: 'Adventure films' },
  ] as const;

  for (const genre of genresToSeed) {
    const existing = await prisma.genres.findUnique({
      where: { slug: genre.slug },
      select: { id: true },
    });

    if (!existing) {
      await prisma.genres.create({
        data: {
          name: genre.name,
          slug: genre.slug,
          description: genre.description,
          status: genre_status.active,
          created_at: now,
          updated_at: now,
        },
      });
      console.log(`Genre "${genre.slug}" created`);
    }
  }

  const genreRecords = await prisma.genres.findMany({
    where: { slug: { in: genresToSeed.map((genre) => genre.slug) } },
    select: { id: true, slug: true },
  });
  const genreBySlug = new Map(genreRecords.map((genre) => [genre.slug, genre]));

  // Seed countries
  const countriesToSeed = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'IN', name: 'India' },
    { code: 'CA', name: 'Canada' },
  ] as const;

  for (const country of countriesToSeed) {
    const existing = await prisma.countries.findUnique({
      where: { name: country.name },
      select: { id: true },
    });

    if (!existing) {
      await prisma.countries.create({
        data: {
          code: country.code,
          name: country.name,
          created_at: now,
          updated_at: now,
        },
      });
      console.log(`Country "${country.name}" created`);
    }
  }

  const countryRecords = await prisma.countries.findMany({
    where: { name: { in: countriesToSeed.map((country) => country.name) } },
    select: { id: true, name: true },
  });
  const countryByName = new Map(
    countryRecords.map((country) => [country.name, country]),
  );

  // Seed tags
  const tagsToSeed = [
    { name: 'Cyberpunk', slug: 'cyberpunk', description: 'Cyberpunk stories' },
    {
      name: 'Time Travel',
      slug: 'time-travel',
      description: 'Time travel plots',
    },
    {
      name: 'Based on True Story',
      slug: 'based-on-true-story',
      description: 'Inspired by real events',
    },
    { name: 'Dystopia', slug: 'dystopia', description: 'Dystopian setting' },
    {
      name: 'Coming of Age',
      slug: 'coming-of-age',
      description: 'Coming of age themes',
    },
    { name: 'Heist', slug: 'heist', description: 'Heist narrative' },
    {
      name: 'Mind-Bending',
      slug: 'mind-bending',
      description: 'Complex nonlinear narratives',
    },
    { name: 'Epic', slug: 'epic', description: 'Epic scale stories' },
  ] as const;

  for (const tag of tagsToSeed) {
    const existing = await prisma.tags.findUnique({
      where: { slug: tag.slug },
      select: { id: true },
    });

    if (!existing) {
      await prisma.tags.create({
        data: {
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          status: tag_status.active,
          created_at: now,
          updated_at: now,
        },
      });
      console.log(`Tag "${tag.slug}" created`);
    }
  }

  const tagRecords = await prisma.tags.findMany({
    where: { slug: { in: tagsToSeed.map((tag) => tag.slug) } },
    select: { id: true, slug: true },
  });
  const tagBySlug = new Map(tagRecords.map((tag) => [tag.slug, tag]));

  // Seed persons
  const personsToSeed = [
    { fullName: 'Keanu Reeves', slug: 'keanu-reeves' },
    { fullName: 'Christopher Nolan', slug: 'christopher-nolan' },
    { fullName: 'Denis Villeneuve', slug: 'denis-villeneuve' },
    { fullName: 'Hans Zimmer', slug: 'hans-zimmer' },
    { fullName: 'Scarlett Johansson', slug: 'scarlett-johansson' },
    { fullName: 'Ryan Gosling', slug: 'ryan-gosling' },
    { fullName: 'Natalie Portman', slug: 'natalie-portman' },
    { fullName: 'Martin Scorsese', slug: 'martin-scorsese' },
    { fullName: 'Greta Gerwig', slug: 'greta-gerwig' },
    { fullName: 'Bong Joon-ho', slug: 'bong-joon-ho' },
    { fullName: 'Joaquin Phoenix', slug: 'joaquin-phoenix' },
    { fullName: 'Emma Stone', slug: 'emma-stone' },
  ] as const;

  for (const person of personsToSeed) {
    const existing = await prisma.persons.findUnique({
      where: { slug: person.slug },
      select: { id: true },
    });

    if (!existing) {
      await prisma.persons.create({
        data: {
          full_name: person.fullName,
          slug: person.slug,
          bio: `Mock bio for ${person.fullName}`,
          status: person_status.visible,
          created_at: now,
          updated_at: now,
        },
      });
      console.log(`Person "${person.slug}" created`);
    }
  }

  const personRecords = await prisma.persons.findMany({
    where: { slug: { in: personsToSeed.map((person) => person.slug) } },
    select: { id: true, slug: true },
  });
  const personBySlug = new Map(
    personRecords.map((person) => [person.slug, person]),
  );

  // Seed films
  const filmsToSeed = Array.from({ length: 50 }, (_, index) => {
    const i = index + 1;
    const adjective = filmAdjectives[index % filmAdjectives.length];
    const noun =
      filmNouns[Math.floor(index / filmAdjectives.length) % filmNouns.length];
    const releaseYear = 1980 + (index % 46);
    const durationMin = 85 + (index % 70);
    const averageRating = Number((5 + (index % 41) * 0.1).toFixed(1));
    const ratingsCount = 100 + index * 37;

    return {
      title: `${adjective} ${noun} ${i}`,
      originalTitle: `mock-film-${String(i).padStart(3, '0')}`,
      description: `Mock description for ${adjective} ${noun} ${i}.`,
      releaseYear,
      durationMin,
      ageRating: ageRatings[index % ageRatings.length],
      averageRating,
      ratingsCount,
      popularityScore: Number((averageRating * ratingsCount * 0.1).toFixed(2)),
      genres: [
        genresToSeed[index % genresToSeed.length].slug,
        genresToSeed[(index + 3) % genresToSeed.length].slug,
      ],
    };
  });

  for (const film of filmsToSeed) {
    const existing = await prisma.films.findUnique({
      where: { original_title: film.originalTitle },
      select: { id: true },
    });

    if (existing) {
      continue;
    }

    const createdFilm = await prisma.films.create({
      data: {
        title: film.title,
        original_title: film.originalTitle,
        description: film.description,
        release_year: film.releaseYear,
        duration_min: film.durationMin,
        age_rating: film.ageRating,
        status: film_status.visible,
        average_rating: film.averageRating,
        ratings_count: film.ratingsCount,
        popularity_score: film.popularityScore,
        created_at: now,
        updated_at: now,
      },
      select: { id: true },
    });

    const filmGenresData = film.genres
      .map((slug) => genreBySlug.get(slug))
      .filter((genre): genre is { id: string; slug: string } => Boolean(genre))
      .map((genre) => ({
        film_id: createdFilm.id,
        genre_id: genre.id,
        created_at: now,
      }));

    if (filmGenresData.length) {
      await prisma.film_genres.createMany({
        data: filmGenresData,
        skipDuplicates: true,
      });
    }
  }

  // Seed film relations (countries, tags, persons) for mock films
  const mockFilms = await prisma.films.findMany({
    where: {
      original_title: { in: filmsToSeed.map((film) => film.originalTitle) },
    },
    select: { id: true, original_title: true },
    orderBy: { original_title: 'asc' },
  });

  const mockCountryNames = countriesToSeed.map((country) => country.name);
  const mockTagSlugs = tagsToSeed.map((tag) => tag.slug);
  const mockPersonSlugs = personsToSeed.map((person) => person.slug);
  const personRoleCycle: role_type[] = [
    role_type.actor,
    role_type.director,
    role_type.writer,
    role_type.producer,
  ];

  for (let i = 0; i < mockFilms.length; i += 1) {
    const film = mockFilms[i];

    const countryNames = [
      mockCountryNames[i % mockCountryNames.length],
      mockCountryNames[(i + 2) % mockCountryNames.length],
    ];
    const tagSlugs = [
      mockTagSlugs[i % mockTagSlugs.length],
      mockTagSlugs[(i + 3) % mockTagSlugs.length],
    ];
    const personSlugs = [
      mockPersonSlugs[i % mockPersonSlugs.length],
      mockPersonSlugs[(i + 1) % mockPersonSlugs.length],
      mockPersonSlugs[(i + 4) % mockPersonSlugs.length],
      mockPersonSlugs[(i + 6) % mockPersonSlugs.length],
    ];

    const filmCountriesData = countryNames
      .map((name) => countryByName.get(name))
      .filter((country): country is { id: string; name: string } =>
        Boolean(country),
      )
      .map((country) => ({
        film_id: film.id,
        country_id: country.id,
        created_at: now,
      }));

    if (filmCountriesData.length) {
      await prisma.film_countries.createMany({
        data: filmCountriesData,
        skipDuplicates: true,
      });
    }

    const filmTagsData = tagSlugs
      .map((slug) => tagBySlug.get(slug))
      .filter((tag): tag is { id: string; slug: string } => Boolean(tag))
      .map((tag) => ({
        film_id: film.id,
        tag_id: tag.id,
        created_at: now,
      }));

    if (filmTagsData.length) {
      await prisma.film_tags.createMany({
        data: filmTagsData,
        skipDuplicates: true,
      });
    }

    for (let k = 0; k < personSlugs.length; k += 1) {
      const person = personBySlug.get(personSlugs[k]);
      if (!person) continue;

      const roleType = personRoleCycle[k % personRoleCycle.length];
      const billingOrder = roleType === role_type.actor ? k + 1 : null;
      const characterName =
        roleType === role_type.actor ? `Character ${k + 1}` : null;

      const existingRole = await prisma.film_person_roles.findFirst({
        where: {
          film_id: film.id,
          person_id: person.id,
          role_type: roleType,
        },
        select: { id: true },
      });

      if (existingRole) {
        continue;
      }

      await prisma.film_person_roles.create({
        data: {
          film_id: film.id,
          person_id: person.id,
          role_type: roleType,
          character_name: characterName,
          billing_order: billingOrder,
          created_at: now,
          updated_at: now,
        },
      });
    }
  }

  const seededUsers = await prisma.users.findMany({
    where: {
      email: {
        in: [
          'admin@example.com',
          'moderator@example.com',
          'user1@example.com',
          'user2@example.com',
          'user3@example.com',
          'user4@example.com',
          'user5@example.com',
          'user6@example.com',
        ],
      },
    },
    select: { id: true, email: true, display_name: true, status: true },
  });
  const userByEmail = new Map(seededUsers.map((user) => [user.email, user]));

  const seedFilmTitles = mockFilms
    .slice(0, 12)
    .map((film) => film.original_title);
  const seededFilms = await prisma.films.findMany({
    where: { original_title: { in: seedFilmTitles } },
    select: { id: true, original_title: true },
  });
  const filmByOriginalTitle = new Map(
    seededFilms.map((film) => [film.original_title, film]),
  );

  // Seed app migration history table
  const migrationEntries = [
    { id: 1, appliedAt: new Date('2026-01-01T00:00:00.000Z') },
    { id: 2, appliedAt: new Date('2026-02-01T00:00:00.000Z') },
    { id: 3, appliedAt: new Date('2026-03-01T00:00:00.000Z') },
  ];

  for (const entry of migrationEntries) {
    await ensureMigrationRecord(entry.id, entry.appliedAt);
  }

  // Seed auth sessions
  const adminSeedUser = userByEmail.get('admin@example.com');
  const moderatorSeedUser = userByEmail.get('moderator@example.com');
  const user1 = userByEmail.get('user1@example.com');
  const user2 = userByEmail.get('user2@example.com');
  const user3 = userByEmail.get('user3@example.com');
  const user4 = userByEmail.get('user4@example.com');
  const user5 = userByEmail.get('user5@example.com');
  const user6 = userByEmail.get('user6@example.com');

  if (adminSeedUser) {
    await ensureAuthSession({
      userId: adminSeedUser.id,
      refreshToken: 'seed-admin-refresh-token',
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      ip: '127.0.0.1',
      userAgent: 'Filmora Seed Script',
    });
  }

  if (moderatorSeedUser) {
    await ensureAuthSession({
      userId: moderatorSeedUser.id,
      refreshToken: 'seed-moderator-refresh-token',
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      ip: '127.0.0.1',
      userAgent: 'Filmora Seed Script',
    });
  }

  if (user1) {
    await ensureAuthSession({
      userId: user1.id,
      refreshToken: 'seed-user1-refresh-token',
      expiresAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      ip: '127.0.0.1',
      userAgent: 'Filmora Seed Script',
    });
  }

  // Seed ratings
  const ratingsToSeed = [
    { user: user1, filmTitle: 'mock-film-001', score: 9 },
    { user: user2, filmTitle: 'mock-film-002', score: 8 },
    { user: user3, filmTitle: 'mock-film-003', score: 7 },
    { user: user4, filmTitle: 'mock-film-004', score: 10 },
    { user: user5, filmTitle: 'mock-film-005', score: 6 },
    { user: user6, filmTitle: 'mock-film-006', score: 8 },
    { user: adminSeedUser, filmTitle: 'mock-film-007', score: 9 },
    { user: moderatorSeedUser, filmTitle: 'mock-film-008', score: 7 },
  ] as const;

  for (const item of ratingsToSeed) {
    const film = filmByOriginalTitle.get(item.filmTitle);
    if (!item.user || !film) continue;

    await ensureRating({
      userId: item.user.id,
      filmId: film.id,
      score: item.score,
    });
  }

  // Seed user lists and list items
  const userListsSeed: any[] = [];
  if (adminSeedUser) {
    userListsSeed.push(
      await ensureUserList({
        userId: adminSeedUser.id,
        name: 'Admin Watchlist',
        type: 'watchlist',
        isPublic: false,
      }),
    );
  }
  if (moderatorSeedUser) {
    userListsSeed.push(
      await ensureUserList({
        userId: moderatorSeedUser.id,
        name: 'Moderator Watchlist',
        type: 'watchlist',
        isPublic: false,
      }),
    );
  }
  if (user1) {
    userListsSeed.push(
      await ensureUserList({
        userId: user1.id,
        name: 'Weekend Picks',
        type: 'custom',
        isPublic: true,
      }),
    );
  }
  if (user2) {
    userListsSeed.push(
      await ensureUserList({
        userId: user2.id,
        name: 'Already Watched',
        type: 'watched',
        isPublic: false,
      }),
    );
  }

  const seedFilmOrder = seedFilmTitles
    .map((title) => filmByOriginalTitle.get(title))
    .filter((film): film is { id: string; original_title: string } =>
      Boolean(film),
    );

  const listFilmPairs = [
    {
      list: userListsSeed[0],
      film: seedFilmOrder[0],
      user: adminSeedUser,
      position: 1,
    },
    {
      list: userListsSeed[0],
      film: seedFilmOrder[1],
      user: adminSeedUser,
      position: 2,
    },
    {
      list: userListsSeed[1],
      film: seedFilmOrder[2],
      user: moderatorSeedUser,
      position: 1,
    },
    {
      list: userListsSeed[2],
      film: seedFilmOrder[3],
      user: user1,
      position: 1,
    },
    {
      list: userListsSeed[2],
      film: seedFilmOrder[4],
      user: user1,
      position: 2,
    },
    {
      list: userListsSeed[3],
      film: seedFilmOrder[5],
      user: user2,
      position: 1,
    },
  ] as const;

  for (const item of listFilmPairs) {
    if (!item.list || !item.film || !item.user) continue;

    await ensureUserListItem({
      listId: item.list.id,
      userId: item.user.id,
      filmId: item.film.id,
      position: item.position,
      note: `Seed item ${item.position}`,
    });
  }

  // Seed reviews, review versions and comments
  const reviewSpecs = [
    {
      user: user1,
      filmTitle: 'mock-film-001',
      title: 'A sharp opener',
      body: 'Strong opening with good pacing.',
    },
    {
      user: user2,
      filmTitle: 'mock-film-002',
      title: 'Visually engaging',
      body: 'The cinematography carries the whole film.',
    },
    {
      user: user3,
      filmTitle: 'mock-film-003',
      title: 'Solid genre piece',
      body: 'A competent and enjoyable watch.',
    },
    {
      user: user4,
      filmTitle: 'mock-film-004',
      title: 'Best one in the batch',
      body: 'This one is the most memorable.',
    },
    {
      user: user5,
      filmTitle: 'mock-film-005',
      title: 'Mixed but promising',
      body: 'The ideas are there even if the execution is uneven.',
    },
    {
      user: user6,
      filmTitle: 'mock-film-006',
      title: 'Crowd pleaser',
      body: 'Easy to recommend for a casual watch.',
    },
  ] as const;

  const reviewsSeed: any[] = [];
  for (const spec of reviewSpecs) {
    const film = filmByOriginalTitle.get(spec.filmTitle);
    if (!spec.user || !film) continue;

    const review = await ensureReview({
      userId: spec.user.id,
      filmId: film.id,
      title: spec.title,
      body: spec.body,
    });

    const firstVersion = await ensureReviewVersion({
      reviewId: review.id,
      versionNumber: 1,
      title: spec.title,
      body: spec.body,
      editedByUserId: spec.user.id,
    });

    const finalVersion =
      spec.user === user4
        ? await ensureReviewVersion({
            reviewId: review.id,
            versionNumber: 2,
            title: `${spec.title} updated`,
            body: `${spec.body} Updated after a second viewing.`,
            editedByUserId: adminSeedUser?.id ?? spec.user.id,
          })
        : firstVersion;

    await prisma.reviews.update({
      where: { id: review.id },
      data: {
        current_version_id: finalVersion.id,
        updated_at: now,
      },
    });

    reviewsSeed.push({ review, film, user: spec.user, version: finalVersion });
  }

  const commentSeeds: any[] = [];
  for (let index = 0; index < reviewsSeed.length; index += 1) {
    const review = reviewsSeed[index];
    const topLevelComment = await ensureComment({
      reviewId: review.review.id,
      userId: adminSeedUser?.id ?? review.user.id,
      body: `Seed comment for ${review.film.original_title}`,
    });

    commentSeeds.push(topLevelComment);

    if (index % 2 === 0 && moderatorSeedUser) {
      const reply = await ensureComment({
        reviewId: review.review.id,
        userId: moderatorSeedUser.id,
        body: `Reply on ${review.film.original_title}`,
        parentId: topLevelComment.id,
      });

      commentSeeds.push(reply);
    }
  }

  // Seed complaints and moderation actions
  const complaint1 = reviewsSeed[0]
    ? await ensureComplaint({
        userId: user2?.id ?? adminSeedUser?.id ?? reviewsSeed[0].user.id,
        targetType: 'review',
        targetId: reviewsSeed[0].review.id,
        reason: 'Review contains spam-like phrasing',
        status: 'pending',
      })
    : null;

  const complaint2 = commentSeeds[0]
    ? await ensureComplaint({
        userId: user3?.id ?? adminSeedUser?.id ?? reviewsSeed[0].user.id,
        targetType: 'comment',
        targetId: commentSeeds[0].id,
        reason: 'Comment is off-topic',
        status: 'in_review',
      })
    : null;

  if (moderatorSeedUser && complaint1 && reviewsSeed[0]) {
    await ensureModerationAction({
      moderatorId: moderatorSeedUser.id,
      targetType: 'review',
      targetId: reviewsSeed[0].review.id,
      actionType: 'hide_review',
      reason: 'Hidden after complaint',
      complaintId: complaint1.id,
    });
  }

  if (moderatorSeedUser && complaint2 && commentSeeds[0]) {
    await ensureModerationAction({
      moderatorId: moderatorSeedUser.id,
      targetType: 'comment',
      targetId: commentSeeds[0].id,
      actionType: 'hide_comment',
      reason: 'Hidden after review',
      complaintId: complaint2.id,
    });
  }

  if (adminSeedUser && user4) {
    await ensureModerationAction({
      moderatorId: adminSeedUser.id,
      targetType: 'user',
      targetId: user4.id,
      actionType: 'block_user',
      reason: 'Seed moderation action',
    });
  }

  if (adminSeedUser && seedFilmOrder[0]) {
    await ensureModerationAction({
      moderatorId: adminSeedUser.id,
      targetType: 'film',
      targetId: seedFilmOrder[0].id,
      actionType: 'hide_film',
      reason: 'Seed moderation action',
    });
  }

  console.log('50 mock films ensured');
  console.log('Mock countries, tags, persons and relations ensured');
  console.log(
    'Auth sessions, ratings, lists, reviews, comments and moderation seeded',
  );

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
