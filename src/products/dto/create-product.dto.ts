import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  baseType,
  categoryTypes,
  plataformTypes,
  SkuDetails,
} from 'src/shared/schema/products';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  imageDetails?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @IsEnum(categoryTypes)
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(plataformTypes)
  plataformTypes: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(baseType)
  baseType: string;

  @IsString()
  @IsNotEmpty()
  productUrl: string;

  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @IsArray()
  @IsNotEmpty()
  requirementSpecification: Record<string, any>[];

  @IsArray()
  @IsNotEmpty()
  highlights: string[];

  @IsOptional()
  @IsArray()
  skuDetails: SkuDetails[];

  @IsOptional()
  stripeProductId?: string;
}
