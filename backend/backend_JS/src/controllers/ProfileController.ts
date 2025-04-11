import { Request, Response } from 'express';
import ProfileService from '../services/ProfileService';

class ProfileController {
  /**
   * Get a profile by ID
   */
  async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const profile = await ProfileService.getProfileById(profileId);
      
      if (!profile) {
        res.status(404).json({ success: false, message: 'Profile not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      console.error('Error getting profile by ID:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Get all profiles
   */
  async getAllProfiles(req: Request, res: Response): Promise<void> {
    try {
      const profiles = await ProfileService.getAllProfiles();
      res.status(200).json({ success: true, data: profiles });
    } catch (error) {
      console.error('Error getting all profiles:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Create a new profile
   */
  async createProfile(req: Request, res: Response): Promise<void> {
    try {
      const profileData = req.body;
      const profile = await ProfileService.createProfile(profileData);
      res.status(201).json({ success: true, data: profile });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Update an existing profile
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      const profileData = req.body;
      
      const updatedProfile = await ProfileService.updateProfile(profileId, profileData);
      
      if (!updatedProfile) {
        res.status(404).json({ success: false, message: 'Profile not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * Delete a profile
   */
  async deleteProfile(req: Request, res: Response): Promise<void> {
    try {
      const { profileId } = req.params;
      
      const result = await ProfileService.deleteProfile(profileId);
      
      if (!result) {
        res.status(404).json({ success: false, message: 'Profile not found' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default new ProfileController(); 