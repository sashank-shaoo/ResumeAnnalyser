import prisma from '../lib/prisma.js';

/**
 * POST /api/users
 * Creates a new user or returns existing user by email.
 * If no email, always creates a new user.
 */
export async function createOrGetUser(req, res, next) {
  try {
    const { name, email, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    let user;

    if (email) {
      // Upsert by email
      user = await prisma.user.upsert({
        where: { email },
        update: { name, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio },
        create: { name, email, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio },
      });
    } else {
      // No email — create fresh user
      user = await prisma.user.create({
        data: { name, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio },
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/users/:id
 * Returns a user with their analyses and saved jobs count.
 */
export async function getUserById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { savedJobs: true, analyses: true } },
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/users/:id
 * Updates an existing user's profile information.
 */
export async function updateUser(req, res, next) {
  try {
    const { name, email, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, preferredLocation, preferredIndustry, experienceLevel, bio, skills, linkedin, github, portfolio },
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}
