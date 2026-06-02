import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
    create(createBusinessDto: CreateBusinessDto, user: any): Promise<import("../entities/business.entity").Business>;
    findAll(user: any): Promise<import("../entities/business.entity").Business[]>;
    findOne(id: string, user: any): Promise<import("../entities/business.entity").Business>;
    update(id: string, updateBusinessDto: Partial<CreateBusinessDto>, user: any): Promise<import("../entities/business.entity").Business>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
