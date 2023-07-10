import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password, birthAt }: CreateUserDTO) {
    password = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.prisma.users.create({
      data: {
        name,
        email,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
    });
  }

  async getAll() {
    return this.prisma.users.findMany();
  }

  async show(id: number) {
    await this.exist(id);

    return this.prisma.users.findUnique({
      where: {
        id,
      },
    });
  }

  async update({ email, name, password, birthAt }: UpdateUserDTO, id: number) {
    await this.exist(id);

    password = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.prisma.users.update({
      data: {
        email,
        name,
        password,
        birthAt: birthAt ? new Date(birthAt) : null,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exist(id);

    return this.prisma.users.delete({
      where: {
        id,
      }
    })
  }

  async exist(id: number) {
    if (!(await this.prisma.users.count({
        where: { id },
      }))
    ) {
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
