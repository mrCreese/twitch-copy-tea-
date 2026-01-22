import { CategoryService } from './category.service';
import { Resolver } from '@nestjs/graphql';

@Resolver('Category')
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}
}
