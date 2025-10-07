import CategoryChange from './variants/category-change/CategoryChange';
import CategoryNotChange from './variants/category-not-change/CategoryNotChange';

function VariantsContainer() {
  return (
    <>
      {/* Category change */}
      <CategoryChange />
      {/* NOT Category change */}
      <CategoryNotChange />
    </>
  );
}
export default VariantsContainer;
