import FormContainer from '@/components/form/FormContainer';
import SubmitButton from '@/components/form/SubmitButton';
import {
  createProductAction,
  deleteProduct,
  deleteProductVariant,
  updateProductAction,
  updateProductVariantAction,
} from '@/utils/actions';

function ProductPage() {
  const deleteProductAction = deleteProduct.bind(null, {
    productId: '1e9e3a52-4bdc-4c4e-9ca2-12dea424d331',
  });
  const deleteProductVariantAction = deleteProductVariant.bind(null, {
    productVariantId: '14b52a98-3486-4e51-863e-416772e15fd0',
  });
  return (
    <>
      <FormContainer action={deleteProductAction}>
        <SubmitButton text='delete product' />
      </FormContainer>
      <FormContainer action={deleteProductVariantAction}>
        <SubmitButton text='delete product variant' />
      </FormContainer>
    </>
  );
  return (
    <div>
      <FormContainer action={updateProductVariantAction}>
        <input
          type='hidden'
          name='id'
          value={'8db66802-cd11-4d65-b68f-639ec2f2d764'}
        />
        <input type='hidden' name='category' value={'clothes'} />
        <label htmlFor='size'>size</label>
        <input type='text' name='size' id='size' defaultValue='extra large' />
        <label htmlFor='sales'>sales</label>
        <input type='text' name='sales' id='sales' defaultValue='999' />
        <label htmlFor='stock'>stock</label>
        <input type='text' name='stock' id='stock' defaultValue='100' />
        <SubmitButton />
      </FormContainer>
    </div>
  );
  return (
    <div>
      <FormContainer action={updateProductAction}>
        {/* Product */}
        <fieldset>
          <legend>Product</legend>
          <label htmlFor='name'>name</label>
          <input
            type='hidden'
            name='productId'
            value={'85b4d09d-efb7-4466-9268-62af6ad6e300'}
          />
          <input
            type='text'
            name='product[name]'
            id='name'
            defaultValue='Urban Voyager'
          />
          <label htmlFor='category'>category</label>
          <input
            type='text'
            name='product[category]'
            id='category'
            defaultValue='bag'
          />
          <label htmlFor='brand'>brand</label>
          <input
            type='text'
            name='product[brand]'
            id='brand'
            defaultValue='aero style'
          />
          <label htmlFor='image'>image</label>
          <input
            type='text'
            name='product[image]'
            id='image'
            defaultValue='image'
          />
          <label htmlFor='price'>price</label>
          <input
            type='text'
            name='product[price]'
            id='price'
            defaultValue='100'
          />
        </fieldset>
        {/* Variant 1 */}
        <fieldset>
          <legend>Variant1</legend>
          {/* <label htmlFor='variant1[productId]'>productId</label>
          <input
            type='text'
            name='variant1[productId]'
            id='variant1[productId]'
            defaultValue='uuid'
          /> */}
          <label htmlFor='variant1[color]'>color</label>
          <input
            type='text'
            name='variant1[color]'
            id='variant1[color]'
            defaultValue='black'
          />
          <label htmlFor='variant1[size]'>size</label>
          <input
            type='text'
            name='variant1[size]'
            id='variant1[size]'
            defaultValue='m'
          />
          <label htmlFor='variant1[stock]'>stock</label>
          <input
            type='text'
            name='variant1[stock]'
            id='variant1[stock]'
            defaultValue='100'
          />
          <label htmlFor='variant1[discount]'>discount</label>
          <input
            type='text'
            name='variant1[discount]'
            id='variant1[discount]'
            defaultValue='25'
          />
        </fieldset>
        {/* Variant 2 */}
        <fieldset>
          <legend>Variant2</legend>
          {/* <label htmlFor='productId'>productId</label>
          <input
            type='text'
            name='variant2[productId]'
            id='productId'
            defaultValue='uuid'
          /> */}
          <label htmlFor='color'>color</label>
          <input
            type='text'
            name='variant2[color]'
            id='color'
            defaultValue='pink'
          />
          <label htmlFor='stock'>stock</label>
          <input
            type='text'
            name='variant2[stock]'
            id='stock'
            defaultValue='250'
          />
        </fieldset>
        <SubmitButton />
      </FormContainer>
    </div>
  );
}
export default ProductPage;
