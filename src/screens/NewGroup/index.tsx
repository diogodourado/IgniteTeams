import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { Container, Content, Icon } from "./styles";

import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";

export function NewGroup() {

    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    async function handleNew() {
        try {

            if (group.trim().length === 0) {
                return Alert.alert('Nova Turma', 'Informe o nome da turma.');
            }
            await groupCreate(group.trim());
            navigation.navigate('players', { group })
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova Turma', error.message); ''
            } else {
                Alert.alert('Nova Turma', 'Não foi possível criar a turma.');
                console.log(error);
            }
        }
    }
    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />
                <Highlight
                    title="Nova turma"
                    subtitle="crie a turma para adicionar as pessoas"
                />

                <Input
                    placeholder="Nome da turma"
                    onChangeText={setGroup}
                />
                <Button
                    title="Criar"
                    onPress={handleNew}
                    style={{ marginTop: 20 }}
                />
            </Content>

        </Container>
    )
}