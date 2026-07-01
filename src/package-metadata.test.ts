import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageManifest = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type PackageLock = {
  packages: {
    "": PackageManifest;
    [key: string]: { version?: string } | PackageManifest;
  };
};

const manifest = JSON.parse(readFileSync("package.json", "utf8")) as PackageManifest;
const lockfile = JSON.parse(readFileSync("package-lock.json", "utf8")) as PackageLock;

describe("package metadata", () => {
  it("pins direct dependency versions to avoid floating installs", () => {
    const floatingSpecs = Object.entries(getDirectDependencies(manifest))
      .filter(([, version]) => isFloatingVersionSpec(version))
      .map(([name, version]) => `${name}@${version}`);

    expect(floatingSpecs).toEqual([]);
  });

  it("keeps package-lock root dependency specs in sync with package.json", () => {
    expect(lockfile.packages[""].dependencies).toEqual(manifest.dependencies);
    expect(lockfile.packages[""].devDependencies).toEqual(manifest.devDependencies);
  });
});

function getDirectDependencies(packageManifest: PackageManifest) {
  return {
    ...packageManifest.dependencies,
    ...packageManifest.devDependencies,
  };
}

function isFloatingVersionSpec(version: string) {
  return version === "latest" || version.startsWith("^") || version.startsWith("~") || version.includes("x") || version.includes("*");
}
