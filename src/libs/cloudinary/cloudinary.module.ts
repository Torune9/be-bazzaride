import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CloudinaryService } from "./cloudinary.service";

@Module({
    imports:[ConfigModule],
    providers: [CloudinaryService],
    exports: [CloudinaryModule],
})

export class CloudinaryModule {}