import Variant from './Variant'
export default interface Variable {
  id: number;
  name: string;
  label: string;
  variants: Variant[];
}
