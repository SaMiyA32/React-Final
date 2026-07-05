import { Request, Response } from 'express';
import { userService } from '../services';
import { IUser } from '../models/user.model';

interface UserResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}


export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        
        const usersWithId = users.map((user: any) => ({
            ...user.toObject ? user.toObject() : user,
            id: user._id,
        }));
        const response: UserResponse = {
            success: true,
            message: 'Users retrieved successfully',
            data: usersWithId
        };
        res.status(200).json(response);
    } catch (error: any) {
        const response: UserResponse = {
            success: false,
            message: 'Error retrieving users',
            error: error.message
        };
        res.status(500).json(response);
    }
};


export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await userService.findUserById(userId);

        if (!user) {
            const response: UserResponse = {
                success: false,
                message: 'User not found'
            };
            res.status(404).json(response);
            return;
        }

        const response: UserResponse = {
            success: true,
            message: 'User retrieved successfully',
            data: user
        };
        res.status(200).json(response);
    } catch (error: any) {
        const response: UserResponse = {
            success: false,
            message: 'Error retrieving user',
            error: error.message
        };
        res.status(500).json(response);
    }
};


export const saveUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
            return;
        }

        
        const userData = {
            name,
            email,
            password,
            phone: phone ? phone.toString() : '',
            address: address || '',
            role: (role as 'admin' | 'customer') || 'customer'
        };

        const user = await userService.createUser(userData);

        
        const { password: _, refreshToken, ...userWithoutSensitiveData } = user.toObject();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userWithoutSensitiveData
        });
    } catch (error: any) {
        console.error('❌ Error creating user:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
};


export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
            return;
        }

        const { name, email, password, phone, address, role } = req.body;
        const updateData: Partial<IUser> = {};

        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (phone !== undefined) updateData.phone = phone.toString();
        if (address !== undefined) updateData.address = address;
        if (role) updateData.role = role;

        const updatedUser = await userService.updateUser(id, updateData);

        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
            return;
        }

        const result = await userService.deleteUser(id);

        if (!result) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};


export const searchUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            const response: UserResponse = {
                success: false,
                message: 'Search query is required'
            };
            res.status(400).json(response);
            return;
        }

        
        const users = await userService.searchUsers(q);

        const response: UserResponse = {
            success: true,
            message: 'Users retrieved successfully',
            data: users
        };

        res.status(200).json(response);
    } catch (error: any) {
        const response: UserResponse = {
            success: false,
            message: 'Error searching users',
            error: error.message
        };
        res.status(500).json(response);
    }
};