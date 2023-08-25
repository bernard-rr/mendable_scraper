import axios from 'axios';
import * as yaml from 'js-yaml';

interface Section {
  content: string;
  source: string;
}

// Interface for the parsed YAML with an index signature
interface YamlObject {
  [key: string]: any;
}

export async function fetchWithRetry(url: string, retries: number = 3): Promise<string> {
  try {
    const response = await axios.get(url);

    // Ensure the server's response is successful
    if (response.status !== 200) {
      throw new Error(`Failed to fetch with status code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    if (retries === 0) throw error;
    return fetchWithRetry(url, retries - 1);
  }
}

export async function scrapeOpenApiYaml(url: string): Promise<Section[]> {
  try {
    // Fetch the YAML content from the URL
    const data = await fetchWithRetry(url);

    // Parse the YAML content
    const parsedYaml: YamlObject = yaml.load(data) as YamlObject;

    // Convert the parsed YAML into sections
    const sections: Section[] = Object.keys(parsedYaml).map(key => {
      return {
        content: yaml.dump({ [key]: parsedYaml[key] }),
        source: url
      };
    });

    return sections;

  } catch (error) {
    console.error("Failed to fetch or parse the YAML:", error);
    return [];
  }
}

// Testing the scraper
scrapeOpenApiYaml('https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.yaml').then(sections => {
  console.log(JSON.stringify(sections, null, 2));
});
