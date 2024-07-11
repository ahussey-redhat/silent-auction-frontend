import { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import {
  Button,
  ButtonVariant,
  Flex,
  InputGroup,
  InputGroupItem,
  MenuToggle,
  Select,
  SelectOption,
  SelectOptionProps,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { useState } from 'react';
import { usePrevious, useUpdateEffect } from 'react-use';
import { useDebounce } from 'use-debounce';

type SelectOptionType = Omit<SelectOptionProps, 'children' | 'label'> & {
  label: MessageDescriptor;
};

const typeOptions: SelectOptionType[] = [
  { value: '', label: msg`Type` },
  { value: 'industry', label: msg`Industry` },
  { value: 'retail', label: msg`Retail` },
];

export default () => {
  const { _ } = useLingui();
  const [typeIsOpen, setTypeIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get('search') ?? '';
  const typeParam = searchParams.get('type') ?? '';

  const [searchInputValue, setSearchInputValue] = useState(searchParam);
  const [searchValue, debounced] = useDebounce(searchInputValue, 1000);
  const previousSearchValue = usePrevious(searchValue);

  useUpdateEffect(() => {
    if (searchValue !== previousSearchValue) {
      const search = new URLSearchParams(location.search);

      if (searchValue) {
        search.set('search', searchValue);
      } else {
        search.delete('search');
      }

      navigate({ search: search.toString() });
    }
  }, [searchValue, previousSearchValue]);

  const onSearchInputChanged = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string,
  ) => setSearchInputValue(value);

  const onSearch = (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (('key' in event && event.key === 'Enter') || event.type === 'click') {
      debounced.flush();
    }
  };

  const onTypeSelect = (
    _event: React.MouseEvent<Element> | undefined,
    value: string | number | undefined,
  ) => {
    const search = new URLSearchParams(location.search);

    if (value && value !== search.get('type')) {
      search.set('type', value.toString());
      navigate({ search: search.toString() });
    } else if (!value && search.has('type')) {
      search.delete('type');
      navigate({ search: search.toString() });
    }

    setTypeIsOpen(false);
  };

  const selectedTypeOption = typeOptions.find(
    ({ value }) => value === typeParam,
  );

  return (
    <Toolbar id="plan-data-toolbar" usePageInsets>
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <ToolbarItem>
              <InputGroup>
                <InputGroupItem isFill>
                  <TextInput
                    name="plan-data-toolbar-search-input"
                    id="plan-data-toolbar-search-input"
                    type="search"
                    aria-label={_(msg`Search input`)}
                    onChange={onSearchInputChanged}
                    onKeyUp={onSearch}
                    value={searchInputValue}
                  />
                </InputGroupItem>
                <InputGroupItem>
                  <Button
                    variant={ButtonVariant.control}
                    aria-label={_(msg`Search button for search input`)}
                    onClick={onSearch}
                  >
                    <SearchIcon />
                  </Button>
                </InputGroupItem>
              </InputGroup>
            </ToolbarItem>
            <ToolbarGroup variant="filter-group">
              <ToolbarItem>
                <Select
                  aria-label={_(msg`Type select`)}
                  selected={typeParam}
                  isOpen={typeIsOpen}
                  toggle={toggleRef => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setTypeIsOpen(prevIsOpen => !prevIsOpen)}
                      isExpanded={typeIsOpen}
                    >
                      {selectedTypeOption ? _(selectedTypeOption.label) : null}
                    </MenuToggle>
                  )}
                  onOpenChange={(isOpen: boolean) => setTypeIsOpen(isOpen)}
                  onSelect={onTypeSelect}
                >
                  {typeOptions.map(({ label, value }) => (
                    <SelectOption key={value} value={value}>
                      {_(label)}
                    </SelectOption>
                  ))}
                </Select>
              </ToolbarItem>
            </ToolbarGroup>
          </Flex>
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  );
};
