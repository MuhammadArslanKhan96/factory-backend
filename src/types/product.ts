export type productProps = {
    name: string;
    description: string;
    price: number;
    image: string;
    id?: number
    // rating: string;
}

export type Product = {
    name: string;
    code: string;
    isCoreRange: boolean;
    orderCode: string;
    url: string;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    orderQuantityInterval: number;
    unit: string;
    isConfigurable: boolean;
    cadSrc: string;
    image: string;
    marketingBadge: string;
    isAddToCartDisabled: boolean;
    isDataSheetAvailable: boolean;
};

export type ProductDetailsType = {
    name: string;
    code: string;
    isCoreRange: boolean;
    orderCode: string;
    url: string;
    minOrderQuantity: number;
    maxOrderQuantity: number;
    orderQuantityInterval: number;
    unit: string;
    isConfigurable: boolean;
    descriptionPoints: string[];
    imageSrc: string;
    marketingBadge: string;
    isArticle: boolean;
    shortCode: string;
    breadcrumbValues: string[];
    identCode1: string;
    identCode2: string;
    isDidactic: boolean;
    shortDescription: string;
};

