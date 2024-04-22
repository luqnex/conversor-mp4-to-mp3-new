import { ChangeEvent, useEffect, useRef, useState } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

import {
  BoxInput,
  Button,
  Container,
  ContainerButton,
  ContentDownload,
  ContentInput,
  DescriptionText,
  InputFile,
  Label,
  ProgressBar,
  Text,
  Title,
  TitleGreen,
} from "./styles";
import { ListItem } from "../../components/ListItem";

export default function Home() {
  const [audioURL, setAudioURL] = useState<string>("");
  const [isProgress, setIsProgress] = useState<boolean>(false);
  const [progressConvert, setProgressConvert] = useState<number>(0);
  const [videoInput, setVideoInput] = useState<File | null | undefined>();

  const ffmpegRef = useRef<FFmpeg | null>();

  const loadFFMPEG = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;

    if (!ffmpeg) return;

    ffmpeg.on("log", ({ message }: any) => {});

    ffmpeg.on("progress", ({ progress }: any) => {
      setProgressConvert(progress);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const handleConvertFile = async () => {
    const ffmpeg = ffmpegRef.current;

    if (!ffmpeg || !videoInput) return;

    setIsProgress(true);

    await ffmpeg.writeFile("input.mp4", await fetchFile(videoInput));

    await ffmpeg.exec(["-i", "input.mp4", "-b:a", "192k", "output.mp3"]);

    const data = await ffmpeg.readFile("output.mp3");

    const url = URL.createObjectURL(new Blob([data], { type: "audio/mp3" }));

    setAudioURL(url);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setVideoInput(event.target?.files?.item(0));
  };

  const handleClearAllStates = () => {
    setVideoInput(null);
    setProgressConvert(0);
    setIsProgress(false);
  };

  useEffect(() => {
    ffmpegRef.current = new FFmpeg();
  }, []);

  useEffect(() => {
    loadFFMPEG();
  }, []);

  return (
    <Container>
      <Title>
        <TitleGreen>Converta seu</TitleGreen>
        <br />
        arquivo facilmente
      </Title>
      <Text>Converta seu arquivo MP4 para MP3 com está aplicação</Text>
      {!videoInput?.name && (
        <ContentInput>
          <BoxInput>
            <Label htmlFor="file">Escolha seu arquivo</Label>
            <InputFile
              id="file"
              name="file"
              type="file"
              accept="mp4"
              title="Select your file to convert"
              onChange={handleChangeInput}
            />

            <DescriptionText>Tamanho máximo de 2GB.</DescriptionText>
          </BoxInput>
        </ContentInput>
      )}

      {videoInput?.name && (
        <ContentDownload>
          <ListItem
            name={videoInput?.name ?? ""}
            size={videoInput?.size ?? 0}
            handleClearAllStates={handleClearAllStates}
          />

          {!isProgress && (
            <ContainerButton>
              <p>1 arquivo selecionado</p>
              <Button disabled={!videoInput} onClick={handleConvertFile}>
                Converter
              </Button>
            </ContainerButton>
          )}

          {isProgress && (
            <ContainerButton>
              <ProgressBar value={progressConvert} max="1" />
              <a
                href={audioURL}
                download={videoInput?.name.replace("mp4", "mp3")}
                title="download"
              >
                <Button disabled={progressConvert < 1}>Download</Button>
              </a>
            </ContainerButton>
          )}
        </ContentDownload>
      )}
    </Container>
  );
}
