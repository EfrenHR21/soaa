import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum categoryTypes {
  operatingSystem = 'Operating System',
  aplicationSoftware = 'Application Software',
}

export enum plataformTypes {
  windows = 'Windows',
  mac = 'Mac',
  linux = 'Linux',
  android = 'Android',
  ios = 'Ios',
}

export enum baseType {
  computer = 'Computer',
  Mobile = 'Mobile',
}

@Schema({ timestamps: true })
export class Feebackers extends mongoose.Document {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  feedback: string;
}

export const FeebackersSchema = SchemaFactory.createForClass(Feebackers);

@Schema({ timestamps: true })
export class SkuDetails extends mongoose.Document {
  @Prop({})
  skuName: string;

  @Prop({})
  price: number;

  @Prop({})
  validity: number;

  @Prop({})
  lifetime: number;

  @Prop({})
  stripePriceId: string;

  @Prop({})
  skuCode?: string;
}

export const skuDetailsSchema = SchemaFactory.createForClass(SkuDetails);

@Schema({ timestamps: true })
export class Products {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    required: true,
    enum: [categoryTypes.operatingSystem, categoryTypes.aplicationSoftware],
  })
  category: string;

  @Prop({
    required: true,
    enum: [
      plataformTypes.windows,
      plataformTypes.mac,
      plataformTypes.linux,
      plataformTypes.android,
      plataformTypes.ios,
    ],
  })
  plataformType: string;

  @Prop({ required: true, enum: [baseType.computer, baseType.Mobile] })
  baseType: string;

  @Prop({ required: true })
  productUrl: string;

  @Prop({ required: true })
  downloadUrl: string;

  @Prop({})
  avgRating: number;

  @Prop([{ type: FeebackersSchema }])
  feebackDetails: Feebackers[];

  @Prop({ type: skuDetailsSchema })
  skuDetails: SkuDetails[];

  @Prop({ type: Object })
  imageDetails: Record<string, any>;

  @Prop({})
  requirementSpecification: Record<string, any>[];

  @Prop({})
  highlights: string[];

  @Prop({})
  stripeProductId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Products);
