
import { getUserList, deleteUser, blockUser, assignRole, removeRole } from '../authUtils';
import { AppRole } from '../types';

export const useAdminFunctions = () => {
  return {
    getUserList,
    deleteUser,
    blockUser,
    assignRole,
    removeRole,
  };
};
