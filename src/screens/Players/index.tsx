import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { AppError } from "@utils/AppError";

import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

import { Input } from "@components/Input";
import { Filter } from "@components/Filters";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { Button } from "@components/Button";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { Loading } from "@components/Loading";

type Routesparams = {
    group: string;
}

export function Players() {

    const [isLoading, setIsLoading] = useState(true);

    const [newPlayerName, setNewPlayerName] = useState('');

    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const navigation = useNavigation();
    const route = useRoute();
    const { group } = route.params as Routesparams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar')
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            setNewPlayerName('');
            fetchPlayersByTeam();

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa,', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possivel adicionar nova pessoa')
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa,', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possivel carregas as pessoas filtradas por time selecionado.')
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePlayerRemove(playName: string) {
        try {

        } catch (error) {
            await playerRemoveByGroup(playName, group);
            fetchPlayersByTeam();

            if (error instanceof AppError) {
                Alert.alert('Nova pessoa,', error.message);
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possivel remover a pessoa');
            }

        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch (error) {
            console.log(error);
            Alert.alert('Remover turma', 'Não foi possivel remover a turma')
        }
    }

    async function handleGroupRemove() {
        try {
            Alert.alert(
                'Remover',
                'Deseja remover a turma?',
                [
                    { text: 'Não', style: 'cancel' },
                    { text: 'Sim', onPress: () => groupRemove() }
                ]
            );

        } catch (error) {
            throw error;
        }
    }
    useEffect(() => {
        fetchPlayersByTeam();
    }, [team])

    return (
        <Container>
            <Header showBackButton />
            <Highlight
                title={group}
                subtitle="adicione a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />
                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B', 'Time C']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {
                isLoading ? <Loading /> :
                    <FlatList
                        data={players}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard
                                name={item.name}
                                onRemove={() => handlePlayerRemove(item.name)}
                            />
                        )}
                        ListEmptyComponent={() => <ListEmpty message="Não há pessoas neste time" />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: 100 },
                            players.length === 0 && { flex: 1 }
                        ]}
                    />
            }

            <Button
                title="Remover Turma"
                type="SECONDARY"
                onPress={handleGroupRemove}
            />

        </Container>
    )
}
