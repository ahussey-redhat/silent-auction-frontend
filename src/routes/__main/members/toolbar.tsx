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

const statusOptions: SelectOptionType[] = [
  { value: '', label: msg`Status` },
  { value: 'active', label: msg`Active` },
  { value: 'inactive', label: msg`Inactive` },
];

const riskOptions: SelectOptionType[] = [
  { value: '', label: msg`Risk` },
  { value: 'low', label: msg`Low` },
  { value: 'medium', label: msg`Medium` },
  { value: 'high', label: msg`High` },
];

export default () => {
  const { _ } = useLingui();
  const [statusIsOpen, setStatusIsOpen] = useState(false);
  const [riskIsOpen, setRiskIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get('search') ?? '';
  const statusParam = searchParams.get('status') ?? '';
  const riskParam = searchParams.get('risk') ?? '';

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

  const onStatusSelect = (
    _event: React.MouseEvent<Element> | undefined,
    value: string | number | undefined,
  ) => {
    const search = new URLSearchParams(location.search);

    if (value && value !== search.get('status')) {
      search.set('status', value.toString());
      navigate({ search: search.toString() });
    } else if (!value && search.has('status')) {
      search.delete('status');
      navigate({ search: search.toString() });
    }

    setStatusIsOpen(false);
  };

  const onRiskSelect = (
    _event: React.MouseEvent<Element> | undefined,
    value: string | number | undefined,
  ) => {
    const search = new URLSearchParams(location.search);

    if (value && value !== search.get('risk')) {
      search.set('risk', value.toString());
      navigate({ search: search.toString() });
    } else if (!value && search.has('risk')) {
      search.delete('risk');
      navigate({ search: search.toString() });
    }

    setRiskIsOpen(false);
  };

  const selectedStatusOption = statusOptions.find(
    ({ value }) => value === statusParam,
  );

  const selectedRiskOption = riskOptions.find(
    ({ value }) => value === riskParam,
  );

  return (
    <Toolbar id="member-data-toolbar" usePageInsets>
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <ToolbarItem>
              <InputGroup>
                <InputGroupItem isFill>
                  <TextInput
                    name="member-data-toolbar-search-input"
                    id="member-data-toolbar-search-input"
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
                  aria-label={_(msg`Status select`)}
                  selected={statusParam}
                  isOpen={statusIsOpen}
                  toggle={toggleRef => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setStatusIsOpen(prevIsOpen => !prevIsOpen)}
                      isExpanded={statusIsOpen}
                    >
                      {selectedStatusOption
                        ? _(selectedStatusOption.label)
                        : null}
                    </MenuToggle>
                  )}
                  onOpenChange={(isOpen: boolean) => setStatusIsOpen(isOpen)}
                  onSelect={onStatusSelect}
                >
                  {statusOptions.map(({ label, value }) => (
                    <SelectOption key={value} value={value}>
                      {_(label)}
                    </SelectOption>
                  ))}
                </Select>
              </ToolbarItem>
              <ToolbarItem>
                <Select
                  aria-label={_(msg`Risk select`)}
                  selected={riskParam}
                  isOpen={riskIsOpen}
                  toggle={toggleRef => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setRiskIsOpen(prevIsOpen => !prevIsOpen)}
                      isExpanded={riskIsOpen}
                    >
                      {selectedRiskOption ? _(selectedRiskOption.label) : null}
                    </MenuToggle>
                  )}
                  onOpenChange={(isOpen: boolean) => setRiskIsOpen(isOpen)}
                  onSelect={onRiskSelect}
                >
                  {riskOptions.map(({ label, value }) => (
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
