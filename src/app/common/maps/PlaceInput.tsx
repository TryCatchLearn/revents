import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { Form } from 'semantic-ui-react';
import usePlacesAutocomplete, { RequestOptions } from 'use-places-autocomplete';

type Props = {
    field: ControllerRenderProps<FieldValues, any>;
    onSelect: (value: any, fieldName: string) => void;
    error: any;
    options?: RequestOptions
    disabled?: boolean
}

export default function PlaceInput({ field, onSelect, error, options, disabled }: Props) {
    const { ready, suggestions: { data, loading }, setValue } = usePlacesAutocomplete({
        requestOptions: options
    })

    return (
        <Form.Select
            disabled={disabled}
            placeholder={`Select ${field.name}...`}
            {...field}
            text={field.value}
            loading={!ready || loading}
            fluid
            search
            selection
            options={data.map(({ description }) => ({
                text: description,
                value: description
            }))}
            onSearchChange={(e: any) => {
                setValue(e.target.value)
            }}
            onChange={(_e, data) => {
                onSelect(data.value, field.name)
            }}
            error={error && error.message}
        />
    )
}