import { ChangeEventHandler } from "react";
import "./search-box.styles.scss";

type SearchBoxProps = {
  className: string;
  id?: string;
  placeholder: string;
  onChangeHandler: ChangeEventHandler<HTMLInputElement>;
};

const SearchBox = ({
  className,
  id,
  onChangeHandler,
  placeholder,
}: SearchBoxProps) => (
  <input
    className={className}
    id={id}
    type="search"
    placeholder={placeholder}
    onChange={onChangeHandler}
  />
);

export default SearchBox;
