import Profile, { IProfile } from '../models/Profile';

class ProfileService {
  /**
   * Get a profile by ID
   */
  async getProfileById(profileId: string): Promise<IProfile | null> {
    return await Profile.findOne({ profileId: profileId });
  }

  /**
   * Get all profiles
   */
  async getAllProfiles(): Promise<IProfile[]> {
    return await Profile.find();
  }

  /**
   * Create a new profile
   */
  async createProfile(profileData: Partial<IProfile>): Promise<IProfile> {
    if (!profileData.profileId) {
      throw new Error('profileId is required to create a profile.');
    }
    const profile = new Profile(profileData);
    return await profile.save();
  }

  /**
   * Update an existing profile
   */
  async updateProfile(profileId: string, profileData: Partial<IProfile>): Promise<IProfile | null> {
    return await Profile.findOneAndUpdate({ profileId: profileId }, profileData, { new: true });
  }

  /**
   * Delete a profile
   */
  async deleteProfile(profileId: string): Promise<boolean> {
    const result = await Profile.deleteOne({ profileId: profileId });
    return result.deletedCount > 0;
  }

  /**
   * Check if any profiles exist in the database
   */
  async profilesExist(): Promise<boolean> {
    const count = await Profile.countDocuments();
    return count > 0;
  }
}

export default new ProfileService(); 