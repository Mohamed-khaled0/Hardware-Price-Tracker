
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithRole } from "@/contexts/auth/types";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  MoreHorizontal,
  Shield,
  UserX,
  LockIcon,
  UnlockIcon,
  AlertCircle
} from "lucide-react";

const Admin: React.FC = () => {
  const { user, isAdmin, getUserList, deleteUser, blockUser, assignRole, removeRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!isAdmin) {
      toast.error("You don't have permission to access this page");
      navigate("/");
      return;
    }
    
    fetchUsers();
  }, [user, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getUserList();
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleToggleBlock = async (userId: string, isCurrentlyBlocked: boolean) => {
    if (userId === user?.id) {
      toast.error("You cannot block your own account");
      return;
    }
    
    try {
      await blockUser(userId, !isCurrentlyBlocked);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error toggling user block status:", error);
    }
  };

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (userId === user?.id) {
      toast.error("You cannot change your own role");
      return;
    }
    
    try {
      if (isCurrentlyAdmin) {
        await removeRole(userId, 'admin');
      } else {
        await assignRole(userId, 'admin');
      }
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error toggling admin role:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">User Management</CardTitle>
            <CardDescription>
              Manage users, roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.username}</span>
                      </TableCell>
                      <TableCell>{user.username || "No username"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.roles?.includes("blocked") ? (
                          <span className="text-red-500 flex items-center gap-1">
                            <LockIcon className="h-4 w-4" />
                            Blocked
                          </span>
                        ) : (
                          <span className="text-green-500 flex items-center gap-1">
                            <UnlockIcon className="h-4 w-4" />
                            Active
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleAdmin(
                                user.id, 
                                user.roles?.includes("admin") || false
                              )}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              {user.roles?.includes("admin")
                                ? "Remove Admin"
                                : "Make Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleBlock(
                                user.id, 
                                user.roles?.includes("blocked") || false
                              )}
                            >
                              {user.roles?.includes("blocked") ? (
                                <>
                                  <UnlockIcon className="mr-2 h-4 w-4" />
                                  Unblock User
                                </>
                              ) : (
                                <>
                                  <LockIcon className="mr-2 h-4 w-4" />
                                  Block User
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <span>No users found</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
