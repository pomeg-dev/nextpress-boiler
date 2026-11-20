"use client";

import cn from "classnames";
import SelectInput from "@ui/components/molecules/SelectInput";
import Button from "@ui/components/atoms/Button";

export const TaxonomyFilter = ({
  taxonomy,
  terms,
  label,
  placeholder,
  type,
  value,
  onChange,
} : {
  taxonomy: string;
  terms: any;
  label: string;
  placeholder: string;
  type: string;
  // The selected term slug, "" for all.
  value: string;
  onChange: (term: string) => void;
}) => {
  const taxTerms = terms.map((term: { term_id: any; slug: any; name: any; }) => {
    const { term_id, slug, name } = term;
    return {
      term_id,
      value: slug,
      label: name
    };
  });

  return (
    <div
      className={cn(
        `filter-${taxonomy}`,
        "transition-[opacity,transform]",
        type === 'select' ? "w-full md:w-64" : "basis-full"
      )}
    >
      {(() => {
          switch (type) {
            case "select":
              return (
                <SelectInput
                  value={value}
                  name={taxonomy}
                  onChange={event => onChange(event.target.value)}
                  placeholder={placeholder ?? 'Show all'}
                  options={taxTerms}
                  label={label}
                />
              );
            case "button":
              return (
                <>
                  {label &&
                    <p className="field-label mb-2" id={`${taxonomy}-label`}>{label}</p>
                  }
                  <div
                    className="flex flex-row flex-wrap gap-2"
                    role="group"
                    aria-labelledby={label ? `${taxonomy}-label` : undefined}
                  >
                    {terms &&
                      <>
                        {terms.length > 1 &&
                          <Button
                            type="button"
                            size="md"
                            style={value === '' ? 'high-contrast' : 'secondary'}
                            pressed={value === ''}
                            onClick={() => onChange("")}
                          >
                            {placeholder ? placeholder : "Show All"}
                          </Button>
                        }
                        {terms.map((term: any) => (
                          <Button
                            type="button"
                            size="md"
                            style={value === term.slug ? 'high-contrast' : 'secondary'}
                            pressed={value === term.slug}
                            key={term.term_id}
                            onClick={() => onChange(term.slug)}
                          >
                            {term.name}
                          </Button>
                        ))}
                      </>
                    }
                  </div>
                </>
              );
          }
      })()}
    </div>
  );
};
