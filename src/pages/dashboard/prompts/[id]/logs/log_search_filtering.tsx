import React from "react";
import { useRouter } from "next/router";
import CustomSelect from "~/components/custom_selector";
import type { FilterOptions } from ".";
import { promptEnvironment, providerModels } from "~/validators/base";
import { api } from "~/utils/api";

interface LogSearchFilteringProps {
  filterOptions: FilterOptions;
  onFilterChange: (filterOptions: FilterOptions) => void;
}

const LogSearchFiltering: React.FC<LogSearchFilteringProps> = ({
  filterOptions = {},
  onFilterChange,
}) => {
  const router = useRouter();
  const packageId = router.query.id as string;

  const environmentOptions = [
    { value: "", label: "Select Environment" },
    ...Object.keys(promptEnvironment.Values).map((value) => ({
      value,
      label: value,
    })),
  ];

  const llmModelOptions = [
    { value: "", label: "All llmModel" },
    ...(Object.keys(providerModels) as (keyof typeof providerModels)[]).flatMap(
      (modelType) => {
        const models = providerModels[modelType].models;
        const allModels = Object.values(models).flat();
        return allModels.map(({ name, label }) => ({ value: name, label }));
      },
    ),
  ];

  const llmProviderOptions = [
    { value: "", label: "All Provider" },
    ...providerModels.TEXT2TEXT.providers.map(({ name, label }) => ({
      value: name,
      label,
    })),
    ...providerModels.TEXT2IMAGE.providers.map(({ name, label }) => ({
      value: name,
      label,
    })),
  ];

  const { data: versionList } = api.version.getLogVersions.useQuery({
    promptPackageId: packageId,
  });

  const versionOptions = [
    { value: "", label: "All Version" },
    ...(versionList
      ? versionList
          .sort((a, b) => {
            const versionA = (a?.version || "0").split(".").map(Number);
            const versionB = (b?.version || "0").split(".").map(Number);

            if (versionA && versionB) {
              for (
                let i = 0;
                i < Math.min(versionA.length, versionB.length);
                i++
              ) {
                if (versionA[i] !== versionB[i]) {
                  return (versionA[i] ?? 0) - (versionB[i] ?? 0);
                }
              }
            }

            return (versionA?.length ?? 0) - (versionB?.length ?? 0);
          })
          .map(({ version }) => ({ value: version, label: version }))
      : []),
  ];

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | undefined,
  ) => {
    onFilterChange({ ...filterOptions, [key]: value || undefined });
  };

  return (
    <div className="mb-6 grid gap-2 md:grid-cols-4">
      <CustomSelect
        label="Environment"
        options={environmentOptions}
        value={filterOptions.environment || ""}
        onChange={(value) => handleFilterChange("environment", value)}
      />
      <CustomSelect
        label="LLM Provider"
        options={llmProviderOptions}
        value={filterOptions.llmProvider || ""}
        onChange={(value) => handleFilterChange("llmProvider", value)}
      />
      <CustomSelect
        label="LLM Model"
        options={llmModelOptions}
        value={filterOptions.llmModel || ""}
        onChange={(value) => handleFilterChange("llmModel", value)}
      />
      <CustomSelect
        label="Version"
        options={versionOptions}
        value={filterOptions.version || ""}
        onChange={(value) => handleFilterChange("version", value)}
      />
    </div>
  );
};

export default LogSearchFiltering;
