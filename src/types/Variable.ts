import Variant from './Variant'
export default interface Variable {
  id: Number;
  name: String;
  label: String;
  variants: Variant[];
}
