import apiClient from '../utilities/api-client';

export const IDENTITY_PROVIDER_LOCAL = 'local';
export const IDENTITY_PROVIDER_ORCID = 'orcid';

// Profile
export const getUserProfile = async (id) => apiClient.get(`/users/${id}`);

export const updateUserProfile = async (id, data) => apiClient.put(`/users/${id}`, data);

// Avatar
export const getUserAvatar = async (id) => apiClient.get(`/users/${id}/avatar`);

export const updateUserAvatar = async (id, data) =>
  apiClient.post(`/users/${id}/avatar`, data, {
    'Content-Type': 'multipart/form-data',
  });

// Password
export const changeUserPassword = async (id, data) => apiClient.put(`/users/${id}/password`, data);

// Invitations
export const getInvites = async () => apiClient.get(`/invites`);

export const updateInvite = async (invitationId, data) =>
  apiClient.put(`/invites/${invitationId}`, data);

// Registration
export const registerUser = async (data) => apiClient.post(`/register`, data);

// SearchTerm
export const searchUsers = async (name) => apiClient.get(`/users?name=${name}`);
