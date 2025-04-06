import java.util.ArrayList;
import java.util.List;

public class Subject {
    private List<Observer> subscribers = new ArrayList<>();

    public void subscribe(Observer observer){
        if(!subscribers.contains(observer)){
            subscribers.add(observer);
        }
    }

    public void unsubscribe(Observer observer){
        subscribers.remove(observer);
    }

    public void notification(String msg){
        for (Observer observer : subscribers){
            observer.update(msg);
        }
    }
}

