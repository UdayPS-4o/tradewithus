import express from 'express';
import ProfileController from '../controllers/ProfileController';
import { validateProfileData } from '../middleware/validationMiddleware';

const router = express.Router();

// GET /profile/all - Get all profiles
router.get('/all', ProfileController.getAllProfiles);

// GET /profile/{profileId} - Get profile by ID
router.get('/:profileId', ProfileController.getProfileById);

// POST /profile - Create a new profile
router.post('/', validateProfileData, ProfileController.createProfile);

// PUT /profile/{profileId} - Update an existing profile
router.put('/:profileId', validateProfileData, ProfileController.updateProfile);

// DELETE /profile/{profileId} - Delete a profile
router.delete('/:profileId', ProfileController.deleteProfile);

export default router; 