import { Controller, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify'; 
import { pipeline } from 'stream';
import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

const pump = util.promisify(pipeline);

@Controller('upload')
export class UploadController {
  constructor(private configService: ConfigService) {}


  @UseGuards(JwtAuthGuard) 
  @Post()
  async uploadFile(@Req() req: FastifyRequest) {
    // 1. Process the incoming multipart file
    const data = await req.file();

    if (!data) {
      throw new BadRequestException('No file uploaded');
    }

    // 2. Validate File Type
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF, JPG, PNG allowed.');
    }

    // 3. Create 'uploads' folder if it doesn't exist
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. Generate Unique Filename
    const fileExtension = data.filename.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // 5. Save the file stream to disk
    await pump(data.file, fs.createWriteStream(filePath));

    const baseUrl = this.configService.get<string>('API_BASE_URL');

    // 6. Return the Public URL
 const fileUrl = `${baseUrl}/uploads/${uniqueFilename}`;
    return { 
      message: 'File uploaded successfully', 
      url: fileUrl,
      filename: uniqueFilename
    };
  }
}