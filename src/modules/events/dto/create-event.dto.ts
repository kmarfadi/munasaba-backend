import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxGuests?: number;

  @IsString()
  @IsOptional()
  category?: string;
}

