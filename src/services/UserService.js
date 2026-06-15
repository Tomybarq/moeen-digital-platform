/**
 * User Service — Mo'een Digital Platform
 *
 * Manages user listing, role changes, invites, and profile updates.
 */
import { userAPI } from "@/services/apiService";

const UserService = {
  async getAll() {
    const result = await userAPI.getAll();
    return result ?? [];
  },

  async update(id, data) {
    return userAPI.update(id, data);
  },

  async updateMe(data) {
    return userAPI.updateMe(data);
  },

  async inviteUser(email, role) {
    return userAPI.inviteUser(email, role);
  },

  async getMe() {
    return userAPI.getMe();
  },
};

export default UserService;