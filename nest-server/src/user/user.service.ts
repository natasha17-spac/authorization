import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'argon2';
import { AuthMethod } from 'prisma/__generated__/enums';

@Injectable()
export class UserService {
	public constructor(private prismaService: PrismaService) {}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		});
		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`);
		}
		return user;
	}
	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		});
		if (!user) {
			throw new NotFoundException(`User with email ${email} not found`);
		}
		return `This action returns a user with email: ${email}`;
	}
	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod,
		isVerified: boolean
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : '',
				displayName,
				picture,
				method,
				isVerified
			},
			include: {
				accounts: true
			}
		});
		return user;
	}
}
