import StaticFavoriteButton from '@/components/favorite/StaticFavoriteButton';
import Container from '@/components/global/Container';
import NoProductFound from '@/components/global/NotFoundContainer';
import PaginationContainer from '@/components/pagination/PaginationContainer';
import ProductGrid from '@/components/product/ProductGrid';
import ProductCard from '@/components/products/ProductCard';
import { fetchAllFavorites } from '@/utils/actions';

type ParamsType = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function FavoritePage({ searchParams }: ParamsType) {
  // Query params
  const queryParams = await searchParams;
  const page = queryParams.page || '';
  const limit = queryParams.limit || '9';
  // Fetch favorite products data
  const favorites = await fetchAllFavorites({ page, limit });

  return (
    <section>
      <Container>
        {/* Products Grid */}
        {!favorites.data.length ? (
          <div className='mx-auto'>
            <NoProductFound />
          </div>
        ) : (
          <ProductGrid>
            {favorites.data.map((favorite) => {
              return (
                <article className='relative' key={favorite.id}>
                  <ProductCard product={favorite.product} />
                  <StaticFavoriteButton
                    productId={favorite.productId}
                    favoriteId={favorite.id}
                    className='absolute top-5 left-6'
                  />
                </article>
              );
            })}
          </ProductGrid>
        )}
        {/* Pagination */}
        <PaginationContainer
          className='my-4 md:my-8 md:justify-end'
          totalPage={favorites.meta.totalPage}
        />
      </Container>
    </section>
  );
}
export default FavoritePage;
