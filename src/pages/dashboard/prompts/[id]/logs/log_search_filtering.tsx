import React from 'react';
import { useRouter } from "next/router";
import CustomSelect from "~/components/custom_selector";
import type { FilterOptions } from '.';
import { promptEnvironment, providers, models } from '~/validators/base';
import { api } from "~/utils/api";

interface LogSearchFilteringProps {
  filterOptions: FilterOptions;
  onFilterChange: (filterOptions: FilterOptions) => void;
}



const LogSearchFiltering: React.FC<LogSearchFilteringProps> = ({ filterOptions = {}, onFilterChange }) => {
  const router = useRouter();
  const packageId = router.query.id as string;

  const environmentOptions = [
    { value: '', label: 'Select Environment' },
    ...Object.keys(promptEnvironment.Values).map((value) => ({
      value,
      label: value,
    })),
  ];

  const llmModelOptions = [
    { value: '', label: 'All llmModel' },
    ...(Object.keys(models) as (keyof typeof models)[]).flatMap(provider =>
      models[provider].map(([value, label]) => ({ value, label }))
    ),
  ];

  const llmProviderOptions = [
    { value: '', label: 'All Provider' },
    ...providers.map(([value, label]) => ({ value, label })),
  ];

  const { data: versionList } = api.logVersion.getVersions.useQuery({
    promptPackageId: packageId,
  });

  const versionOptions = [
    { value: '', label: 'All Version' },
    ...(versionList
      ? versionList.map(({ version }) => ({ value: version, label: version }))
      : [])
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    onFilterChange({ ...filterOptions, [key]: value || undefined });
  };

  return(
    <div className="grid gap-2 mb-6 md:grid-cols-4">
      <CustomSelect
        label="Environment"
        options={environmentOptions}
        value={filterOptions.environment || ''}
        onChange={(value) => handleFilterChange('environment', value)}
      />
      <CustomSelect
        label="LLM Model"
        options={llmModelOptions}
        value={filterOptions.llmModel || ''}
        onChange={(value) => handleFilterChange('llmModel', value)}
      />
      <CustomSelect
        label="LLM Provider"
        options={llmProviderOptions}
        value={filterOptions.llmProvider || ''}
        onChange={(value) => handleFilterChange('llmProvider', value)}
      />
      <CustomSelect
        label="Version"
        options={versionOptions}
        value={filterOptions.version || ''}
        onChange={(value) => handleFilterChange('version', value)}
      />
    </div>
  )
}

export default LogSearchFiltering;
