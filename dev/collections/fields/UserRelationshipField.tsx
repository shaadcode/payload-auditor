'use client';
import * as React from 'react';
import { RelationshipInput, useField } from '@payloadcms/ui';
import type { CollectionSlug, JSONFieldClientComponent } from 'payload';


interface UserData {
  collection: CollectionSlug;
  id: string;
}

export const UserRelationshipField: JSONFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField({ path }) as {
    value: UserData | null;
    setValue: (val: unknown) => void;
  };

  const handleChange = React.useCallback(
    (val: unknown) => {
      setValue(val);
    },
    [setValue],
  );

  if (!value?.collection || !value?.id) {
    return <RelationshipInput path={path} relationTo={[]} onChange={handleChange} hasMany={false} />;
  }

  return (
    <RelationshipInput
      path={path}
      relationTo={[value.collection]}
      onChange={handleChange}
      hasMany={false}
      value={{ relationTo: value.collection, value: value.id }}
      Label="User"
    />
  );
};
